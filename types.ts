export interface BasicInfo {
  "姓名": string;
  "性别": string;
  "年龄": number;
  "身体+爱好": string;
  "性格": string;
  "家庭": string;
}

export interface WorkExperience {
  "同行业年限": number;
  "跳槽次数": number;
  "曾担任工作": string;
}

export interface Education {
  "学历": string;
  "学校": string;
  "专业": string;
}

export interface Values {
  "与公司价值观相符": string;
  "与团队一起成长": string;
}

export interface Competency {
  "表达能力": string;
  "思维能力": string;
  "心理素质": string;
}

export interface ProfessionalSkills {
  "技术层面": string;
  "业务层面": string;
  "变现层面": string;
}

export interface PersonalityTraits {
  "工作效率": string;
  "创造性思维": string;
  "商业嗅机": string;
  "个人亲和力": string;
  "思想超越": string;
}

export interface KnowledgeSkills {
  "公司方案产品理解能力": number;
  "行业知识": number;
  "专业知识": number;
  [key: string]: number;
}

export interface AbilityRequirements {
  "客户痛点识别及需求探索能力": number;
  "方案设计能力": number;
  "业务价值传递能力": number;
  "客户关系管理与高层对话能力": number;
  "资源协调组织能力": number;
  [key: string]: number;
}

export interface Employee {
  "序号": number;
  "基本信息": BasicInfo;
  "工作经历": WorkExperience;
  "教育背景": Education;
  "价值观": Values;
  "胜任能力": Competency;
  "专业技能": ProfessionalSkills;
  "人格特质": PersonalityTraits;
  "知识技能": KnowledgeSkills;
  "能力要求": AbilityRequirements;
}

// AI Analysis is now just text, score is separate
export interface AIAnalysisResult {
  persona: string;
  diagnosis: string;
}

export interface AnalyzedEmployee extends Employee {
  calculatedScore: number; // Local score
  aiAnalysis?: AIAnalysisResult; // Fetched on demand
  isAnalyzing?: boolean; // UI state for loading
}