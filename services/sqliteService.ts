import initSqlJs, { QueryExecResult } from "sql.js";
import { AnalyzedEmployee, Employee } from "../types";
import { calculateEmployeeScore } from "../utils/scoring";

type Row = Record<string, any>;

const isAbsoluteUrl = (value: string): boolean =>
  /^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(value) || value.startsWith("data:");

const resolveDbUrl = (dbPath: string | undefined, assetBase: string): string => {
  const candidate = dbPath?.trim() || "hr.db";
  if (isAbsoluteUrl(candidate) || candidate.startsWith("/")) {
    return candidate;
  }
  return `${assetBase}${candidate}`;
};

const toRows = (result?: QueryExecResult): Row[] => {
  if (!result) return [];
  return result.values.map((row) =>
    row.reduce<Row>((acc, value, index) => {
      acc[result.columns[index]] = value;
      return acc;
    }, {})
  );
};

const toLookup = (rows: Row[], key: string): Record<number, Row> => {
  return rows.reduce<Record<number, Row>>((acc, row) => {
    const id = Number(row[key]);
    if (Number.isFinite(id)) acc[id] = row;
    return acc;
  }, {});
};

const groupBy = (rows: Row[], key: string): Record<number, Row[]> => {
  return rows.reduce<Record<number, Row[]>>((acc, row) => {
    const id = Number(row[key]);
    if (!Number.isFinite(id)) return acc;
    acc[id] = acc[id] || [];
    acc[id].push(row);
    return acc;
  }, {});
};

const ensureText = (value: unknown, fallback = "待补充"): string => {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
};

const ensureLevelText = (value: unknown, fallback = "中"): string => {
  const text = ensureText(value, "");
  return text || fallback;
};

const ensureScore = (value: unknown, fallback = 3): number => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "高") return 5;
    if (trimmed === "中") return 4;
    if (trimmed === "低") return 3;
  }
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const pickStringAbility = (
  abilities: Row[],
  category: string,
  ability: string,
  fallback = "中"
): string => {
  const hit = abilities.find(
    (row) => row.category === category && row.ability === ability
  );
  return ensureLevelText(hit?.level_text ?? hit?.score, fallback);
};

const pickNumericAbility = (
  abilities: Row[],
  category: string,
  ability: string,
  fallback = 3
): number => {
  const hit = abilities.find(
    (row) => row.category === category && row.ability === ability
  );
  return ensureScore(hit?.score ?? hit?.level_text, fallback);
};

export const loadEmployeesFromDatabase = async (
  dbPath?: string
): Promise<AnalyzedEmployee[]> => {
  const assetBase = import.meta.env.BASE_URL || "/";
  const SQL = await initSqlJs({
    locateFile: (file) => `${assetBase}${file}`,
  });

  const dbUrl = resolveDbUrl(dbPath, assetBase);
  const response = await fetch(dbUrl);
  if (!response.ok) {
    throw new Error(
      `无法读取 SQLite 数据库(${dbUrl})，请确认它可通过 HTTP 访问。`
    );
  }

  const buffer = await response.arrayBuffer();
  const db = new SQL.Database(new Uint8Array(buffer));

  const persons = toRows(
    db.exec("SELECT id, seq, name, gender, age FROM person")[0]
  );
  const basics = toLookup(
    toRows(
      db.exec("SELECT person_id, hobby, personality, family FROM person_basic")[
        0
      ]
    ),
    "person_id"
  );
  const work = toLookup(
    toRows(
      db.exec(
        "SELECT person_id, years_in_industry, job_hops, previous_job FROM person_work"
      )[0]
    ),
    "person_id"
  );
  const education = toLookup(
    toRows(
      db.exec("SELECT person_id, degree, school, major FROM person_education")[0]
    ),
    "person_id"
  );
  const abilityLookup = groupBy(
    toRows(
      db.exec(
        "SELECT person_id, category, ability, level_text, score FROM ability_score"
      )[0]
    ),
    "person_id"
  );

  const employees: AnalyzedEmployee[] = persons.map((person, index) => {
    const personId = Number(person.id);
    const abilityRows = abilityLookup[personId] || [];

    const stringCategory = (
      category: string,
      keys: string[],
      fallback = "中"
    ) =>
      keys.reduce<Record<string, string>>((acc, key) => {
        acc[key] = pickStringAbility(abilityRows, category, key, fallback);
        return acc;
      }, {});

    const numericCategory = (category: string, keys: string[]) =>
      keys.reduce<Record<string, number>>((acc, key) => {
        acc[key] = pickNumericAbility(abilityRows, category, key);
        return acc;
      }, {});

    const employee: Employee = {
      序号: Number(person.seq) || Number(person.id) || index + 1,
      基本信息: {
        姓名: ensureText(person.name, "未命名"),
        性别: ensureText(person.gender, "未知"),
        年龄: Number(person.age) || 0,
        "身体+爱好": ensureText(basics[personId]?.hobby),
        性格: ensureText(basics[personId]?.personality),
        家庭: ensureText(basics[personId]?.family),
      },
      工作经历: {
        同行业年限: ensureScore(work[personId]?.years_in_industry, 0),
        跳槽次数: ensureScore(work[personId]?.job_hops, 0),
        曾担任工作: ensureText(work[personId]?.previous_job),
      },
      教育背景: {
        学历: ensureText(education[personId]?.degree),
        学校: ensureText(education[personId]?.school),
        专业: ensureText(education[personId]?.major),
      },
      价值观: stringCategory("价值观", ["与公司价值观相符", "与团队一起成长"], "待补充"),
      胜任能力: stringCategory("胜任能力", ["表达能力", "思维能力", "心理素质"]),
      专业技能: stringCategory("专业技能", ["技术层面", "业务层面", "变现层面"]),
      人格特质: stringCategory(
        "人格特质",
        ["工作效率", "创造性思维", "商业嗅机", "个人亲和力", "思想超越"]
      ),
      知识技能: numericCategory("知识技能", [
        "公司方案产品理解能力",
        "行业知识",
        "专业知识",
      ]),
      能力要求: numericCategory("能力要求", [
        "客户痛点识别及需求探索能力",
        "方案设计能力",
        "业务价值传递能力",
        "客户关系管理与高层对话能力",
        "资源协调组织能力",
      ]),
    };

    const calculatedScore = calculateEmployeeScore(employee);

    return {
      ...employee,
      calculatedScore,
    };
  });

  db.close();

  return employees.sort((a, b) => Number(a.序号) - Number(b.序号));
};
