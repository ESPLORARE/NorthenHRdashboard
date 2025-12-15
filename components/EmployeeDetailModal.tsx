import React, { useEffect } from 'react';
import { AnalyzedEmployee } from '../types';
import RadarChartComponent from './RadarChartComponent';

interface Props {
  employee: AnalyzedEmployee | null;
  onClose: () => void;
  onAnalyze: (emp: AnalyzedEmployee) => void;
}

const LevelBadge: React.FC<{ level: string | number }> = ({ level }) => {
  let colorClass = "bg-slate-100 text-slate-600";
  const val = String(level).trim();
  if (val === "高" || val === "5") colorClass = "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20";
  else if (val === "中" || val === "4") colorClass = "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20";
  else if (val === "低" || val === "3" || val === "2" || val === "1") colorClass = "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20";
  
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {level}
    </span>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-8">
    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
        {title}
        <span className="h-px bg-slate-100 flex-grow"></span>
    </h4>
    <div className="text-sm text-slate-700">{children}</div>
  </div>
);

const InfoItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="flex flex-col mb-1 group">
    <span className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5 group-hover:text-emerald-500 transition-colors">{label}</span>
    <span className="font-semibold text-slate-800 text-base break-words">{value}</span>
  </div>
);

const AttributeBox: React.FC<{ title: string; data: Record<string, any>; className?: string }> = ({ title, data, className }) => (
    <div className={`bg-slate-50/50 rounded-2xl p-5 ${className}`}>
        <h5 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            {title}
        </h5>
        <div className="space-y-3">
            {Object.entries(data).map(([k, v]) => (
                <div key={k} className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">{k}</span>
                    <LevelBadge level={v as string} />
                </div>
            ))}
        </div>
    </div>
);

const EmployeeDetailModal: React.FC<Props> = ({ employee, onClose, onAnalyze }) => {
  useEffect(() => {
    if (employee && !employee.aiAnalysis && !employee.isAnalyzing) {
      onAnalyze(employee);
    }
  }, [employee]);

  if (!employee) return null;

  const { 基本信息, 工作经历, 教育背景, 价值观, 胜任能力, 专业技能, 人格特质, 知识技能, 能力要求 } = employee;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-slate-900/40 transition-opacity backdrop-blur-sm" onClick={onClose} aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full border border-slate-100">
            
            {/* Header with clean gradient */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-6 flex justify-between items-start text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 rounded-full blur-3xl"></div>
                
                <div className="relative z-10">
                     <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-3xl font-bold tracking-tight text-white">
                            {基本信息.姓名}
                        </h3>
                        <span className="text-xs font-mono text-slate-400 border border-slate-700 px-1.5 py-0.5 rounded">
                            ID: {employee.序号}
                        </span>
                     </div>
                     <div className="flex items-center gap-3 text-slate-300 text-sm font-medium">
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            {基本信息.性别}
                        </span>
                        <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                        <span>{基本信息.年龄}岁</span>
                        <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                            {基本信息.家庭}
                        </span>
                     </div>
                </div>

                <div className="flex flex-col items-end relative z-10">
                    <div className="text-right">
                         <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">综合评分</span>
                         <span className={`text-5xl font-extrabold tracking-tighter ${employee.calculatedScore >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {employee.calculatedScore}
                         </span>
                    </div>
                </div>
                
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full z-20 backdrop-blur-sm">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* AI Analysis Banner - Modernized */}
            <div className="bg-gradient-to-b from-purple-50/80 to-white px-8 py-6 border-b border-purple-100/50">
                {employee.isAnalyzing ? (
                    <div className="flex items-center gap-3 text-purple-600 animate-pulse py-2">
                         <div className="h-5 w-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                         <span className="font-medium text-sm">AI 正在深度分析该候选人...</span>
                    </div>
                ) : employee.aiAnalysis ? (
                    <div>
                         <div className="flex items-center gap-3 mb-3">
                             <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md shadow-purple-500/20 uppercase tracking-wide">
                                AI 智能画像
                             </div>
                             <h4 className="text-lg font-bold text-slate-800 tracking-tight">{employee.aiAnalysis.persona}</h4>
                         </div>
                         <p className="text-slate-600 leading-relaxed text-sm max-w-4xl font-medium">
                            {employee.aiAnalysis.diagnosis}
                         </p>
                    </div>
                ) : (
                    <div className="text-slate-400 italic text-sm py-2">点击进行 AI 分析...</div>
                )}
            </div>

            {/* Main Content Scrollable Area */}
            <div className="px-8 py-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                 
                 {/* Top Row: Info & History */}
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-10">
                    {/* Col 1: Basic & Edu */}
                    <div className="lg:col-span-1 space-y-8">
                        <Section title="基础信息">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                <InfoItem label="身体 / 爱好" value={基本信息["身体+爱好"]} />
                                <InfoItem label="性格特点" value={基本信息.性格} />
                            </div>
                        </Section>
                        <Section title="教育背景">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                <InfoItem label="毕业院校" value={教育背景.学校} />
                                <InfoItem label="最高学历" value={教育背景.学历} />
                                <div className="col-span-2">
                                    <InfoItem label="专业方向" value={教育背景.专业} />
                                </div>
                            </div>
                        </Section>
                    </div>

                    {/* Col 2: Work History */}
                    <div className="lg:col-span-1">
                        <Section title="工作经历">
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                    <InfoItem label="同行业经验" value={`${工作经历.同行业年限}年`} />
                                    <InfoItem label="跳槽频率" value={`${工作经历.跳槽次数}次`} />
                                </div>
                                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-2">曾担任工作</span>
                                    <p className="text-sm font-semibold text-slate-800 leading-relaxed">{工作经历.曾担任工作}</p>
                                </div>
                            </div>
                        </Section>
                    </div>
                 </div>

                 {/* Middle Row: Charts - Full Width Side-by-Side */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6 flex flex-col min-h-[320px]">
                         <h6 className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">知识技能图谱</h6>
                         <div className="flex-1 w-full">
                            <RadarChartComponent data={知识技能} color="#8b5cf6" dataKeyName="评分" />
                         </div>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6 flex flex-col min-h-[320px]">
                         <h6 className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">核心能力要求</h6>
                         <div className="flex-1 w-full">
                            <RadarChartComponent data={能力要求} color="#10b981" dataKeyName="评分" />
                         </div>
                    </div>
                 </div>

                 {/* Bottom Grid: Qualitative Matrix */}
                 <div className="border-t border-slate-100 pt-10">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 text-center">综合素质评估矩阵</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <AttributeBox title="价值观" data={价值观} />
                        <AttributeBox title="胜任能力" data={胜任能力} />
                        <AttributeBox title="专业技能" data={专业技能} />
                        <AttributeBox title="人格特质" data={人格特质} />
                    </div>
                 </div>

            </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailModal;