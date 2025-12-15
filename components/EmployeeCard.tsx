import React from 'react';
import { AnalyzedEmployee } from '../types';

interface Props {
  data: AnalyzedEmployee;
  onClick: () => void;
}

const EmployeeCard: React.FC<Props> = ({ data, onClick }) => {
  const { 基本信息, calculatedScore, aiAnalysis } = data;

  // Determine colors based on score
  let scoreTheme = { text: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' };
  if (calculatedScore >= 90) scoreTheme = { text: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' };
  else if (calculatedScore >= 80) scoreTheme = { text: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-100 cursor-pointer hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 group-hover:text-emerald-600 transition-colors">
                    {基本信息.姓名}
                </h3>
                <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{基本信息.年龄}岁</span>
                    <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{data.教育背景.学历}</span>
                </div>
            </div>
            
            <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl ${scoreTheme.bg} border ${scoreTheme.border}`}>
                <span className={`text-xl font-bold ${scoreTheme.text}`}>{calculatedScore}</span>
            </div>
        </div>

        <div className="space-y-3">
             <div className="flex items-start gap-2 text-sm text-slate-600">
                <svg className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="line-clamp-1 opacity-90">{基本信息.曾担任工作 || data.工作经历.曾担任工作}</span>
             </div>
             
             <div className="flex items-start gap-2 text-sm text-slate-600">
                <svg className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="opacity-90">{data.工作经历.同行业年限}年行业经验</span>
             </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-50">
             {aiAnalysis ? (
                 <div className="inline-flex items-center gap-2 w-full">
                     <span className="flex-shrink-0 w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                     <span className="text-xs font-semibold text-purple-700 truncate">
                        {aiAnalysis.persona}
                     </span>
                 </div>
             ) : (
                 <div className="flex items-center gap-1.5 text-xs text-slate-400 group-hover:text-emerald-500 transition-colors">
                    <span>AI 深度诊断</span>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                 </div>
             )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;