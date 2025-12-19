import json
import sqlite3

DB_PATH = "hr.db"
JSON_PATH = "people.json"

# 文本等级 → 数值映射
LEVEL_MAP = {
    "高": 4,
    "中": 3,
    "低": 2
}

def parse_level(value):
    """
    处理：
    - "高"
    - "全能，高"
    - "技术弱，中"
    - 数字（直接返回）
    """
    if value is None:
        return None, None

    if isinstance(value, (int, float)):
        return None, float(value)

    if isinstance(value, str):
        parts = [p.strip() for p in value.split(",")]
        if len(parts) == 1:
            return value, LEVEL_MAP.get(parts[0])
        else:
            return value, LEVEL_MAP.get(parts[-1])

    return None, None


def main():
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        people = json.load(f)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    for person in people:
        seq = person.get("序号")
        basic = person.get("基本信息", {})

        # 1️⃣ person
        cursor.execute("""
            INSERT OR IGNORE INTO person (seq, name, gender, age)
            VALUES (?, ?, ?, ?)
        """, (
            seq,
            basic.get("姓名"),
            basic.get("性别"),
            basic.get("年龄")
        ))

        cursor.execute("SELECT id FROM person WHERE seq = ?", (seq,))
        person_id = cursor.fetchone()[0]

        # 2️⃣ person_basic
        cursor.execute("""
            INSERT OR REPLACE INTO person_basic
            (person_id, hobby, personality, family)
            VALUES (?, ?, ?, ?)
        """, (
            person_id,
            basic.get("身体+爱好"),
            basic.get("性格"),
            basic.get("家庭")
        ))

        # 3️⃣ person_work
        work = person.get("工作经历", {})
        cursor.execute("""
            INSERT OR REPLACE INTO person_work
            (person_id, years_in_industry, job_hops, previous_job)
            VALUES (?, ?, ?, ?)
        """, (
            person_id,
            work.get("同行业年限"),
            work.get("跳槽次数"),
            work.get("曾担任工作")
        ))

        # 4️⃣ person_education
        edu = person.get("教育背景", {})
        cursor.execute("""
            INSERT OR REPLACE INTO person_education
            (person_id, degree, school, major)
            VALUES (?, ?, ?, ?)
        """, (
            person_id,
            edu.get("学历"),
            edu.get("学校"),
            edu.get("专业")
        ))

        # 5️⃣ ability_score（六大模块）
        ability_categories = [
            "价值观",
            "胜任能力",
            "专业技能",
            "人格特质",
            "知识技能",
            "能力要求"
        ]

        for category in ability_categories:
            abilities = person.get(category, {})
            for ability, raw_value in abilities.items():
                level_text, score = parse_level(raw_value)

                cursor.execute("""
                    INSERT INTO ability_score
                    (person_id, category, ability, level_text, score)
                    VALUES (?, ?, ?, ?, ?)
                """, (
                    person_id,
                    category,
                    ability,
                    level_text,
                    score
                ))

    conn.commit()
    conn.close()
    print("✅ JSON 数据已全部导入 SQLite")


if __name__ == "__main__":
    main()
