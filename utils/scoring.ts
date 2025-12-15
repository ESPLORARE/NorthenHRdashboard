import { Employee } from "../types";

// Helper to convert "High/Medium/Low" to numeric score 0-100
const parseLevel = (val: string | number): number => {
  const v = String(val).trim();
  if (v === '高' || v === '5') return 95;
  if (v === '中' || v === '4') return 75;
  if (v === '低' || v === '3' || v === '2' || v === '1') return 55;
  return 60; // Default
};

// Helper to convert 1-5 scale to 0-100
const parseScale = (val: number): number => {
  return (val / 5) * 100;
};

export const calculateEmployeeScore = (emp: Employee): number => {
  let totalScore = 0;
  let weights = 0;

  // 1. Knowledge (Numeric 1-5) - Weight: 25%
  const knowledgeKeys = ["公司方案产品理解能力", "行业知识", "专业知识"];
  let knowledgeSum = 0;
  knowledgeKeys.forEach(k => { knowledgeSum += parseScale(emp.知识技能[k] || 3); });
  totalScore += (knowledgeSum / knowledgeKeys.length) * 0.25;
  weights += 0.25;

  // 2. Abilities (Numeric 1-5) - Weight: 35%
  const abilityKeys = ["客户痛点识别及需求探索能力", "方案设计能力", "业务价值传递能力", "客户关系管理与高层对话能力", "资源协调组织能力"];
  let abilitySum = 0;
  abilityKeys.forEach(k => { abilitySum += parseScale(emp.能力要求[k] || 3); });
  totalScore += (abilitySum / abilityKeys.length) * 0.35;
  weights += 0.35;

  // 3. Personality Traits (Qualitative) - Weight: 20%
  const traits = Object.values(emp.人格特质);
  let traitSum = 0;
  traits.forEach(t => { traitSum += parseLevel(t); });
  totalScore += (traitSum / traits.length) * 0.20;
  weights += 0.20;

  // 4. Competency & Skills (Qualitative) - Weight: 20%
  const compValues = [...Object.values(emp.胜任能力), ...Object.values(emp.专业技能)];
  let compSum = 0;
  compValues.forEach(c => { compSum += parseLevel(c); });
  totalScore += (compSum / compValues.length) * 0.20;
  weights += 0.20;

  return Math.round(totalScore);
};
