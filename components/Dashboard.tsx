import React from 'react';
import { AnalyzedEmployee } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  employees: AnalyzedEmployee[];
}

const StatCard: React.FC<{ title: string; value: string | number; sub?: React.ReactNode; colorClass: string; iconPath: string }> = ({ title, value, sub, colorClass, iconPath }) => (
    <div className="bg-white p-6 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${colorClass}`}>
            <svg className="h-16 w-16 transform rotate-12" fill="currentColor" viewBox="0 0 24 24">
                <path d={iconPath} />
            </svg>
        </div>
        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">{title}</h3>
        <div className="relative z-10 flex items-baseline gap-2">
            <p className={`text-4xl font-extrabold tracking-tight ${colorClass.replace('bg-', 'text-')}`}>{value}</p>
            {sub}
        </div>
    </div>
);

const Dashboard: React.FC<Props> = ({ employees }) => {
  // Sort descending by calculatedScore
  const sortedEmployees = [...employees].sort((a, b) => b.calculatedScore - a.calculatedScore);

  const chartData = sortedEmployees.map(e => ({
    name: e.基本信息.姓名,
    score: e.calculatedScore,
  }));

  const avgScore = Math.round(employees.reduce((acc, curr) => acc + curr.calculatedScore, 0) / (employees.length || 1));

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
            title="团队总人数" 
            value={employees.length} 
            colorClass="text-slate-800"
            iconPath="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
        <StatCard 
            title="综合平均分" 
            value={avgScore} 
            colorClass="text-emerald-600"
            iconPath="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
        <StatCard 
            title="当前最高分" 
            value={sortedEmployees[0]?.calculatedScore || 0} 
            sub={<span className="text-sm font-medium text-slate-400">/ {sortedEmployees[0]?.基本信息.姓名}</span>}
            colorClass="text-purple-600"
            iconPath="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Ranking Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-white">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                    人才排行榜
                </h3>
            </div>
            <div className="overflow-x-auto flex-grow">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50/50 text-xs uppercase font-bold text-slate-400 tracking-wider">
                        <tr>
                            <th className="px-8 py-4 font-semibold">排名</th>
                            <th className="px-6 py-4 font-semibold">姓名</th>
                            <th className="px-6 py-4 font-semibold">年龄</th>
                            <th className="px-6 py-4 font-semibold">学历</th>
                            <th className="px-8 py-4 font-semibold text-right">总分</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {sortedEmployees.map((emp, idx) => (
                            <tr key={emp.序号} className="hover:bg-slate-50/80 transition-colors group">
                                <td className="px-8 py-5 font-medium text-slate-400 group-hover:text-slate-600">
                                    {idx + 1 === 1 ? <span className="text-xl">🥇</span> : 
                                     idx + 1 === 2 ? <span className="text-xl">🥈</span> : 
                                     idx + 1 === 3 ? <span className="text-xl">🥉</span> : 
                                     <span className="font-mono text-slate-300">#{idx + 1}</span>}
                                </td>
                                <td className="px-6 py-5">
                                    <div className="font-bold text-slate-700 text-base group-hover:text-emerald-600 transition-colors">{emp.基本信息.姓名}</div>
                                </td>
                                <td className="px-6 py-5 text-slate-500">{emp.基本信息.年龄}</td>
                                <td className="px-6 py-5">
                                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                                        {emp.教育背景.学历}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <span className={`font-bold text-lg ${idx < 3 ? 'text-emerald-600' : 'text-slate-700'}`}>
                                        {emp.calculatedScore}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-100 p-8 flex flex-col">
            <h3 className="font-bold text-slate-800 text-lg mb-8 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
                分数分布
            </h3>
            <div className="flex-grow min-h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }} barSize={12}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis 
                            dataKey="name" 
                            type="category" 
                            width={70} 
                            tick={{fontSize: 13, fill: '#64748b', fontWeight: 500}} 
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip 
                            cursor={{fill: '#f8fafc'}}
                            contentStyle={{ 
                                borderRadius: '12px', 
                                border: 'none', 
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', 
                                padding: '12px 16px',
                                fontFamily: 'sans-serif'
                            }}
                        />
                        <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={
                                        entry.score >= 90 ? '#10b981' : 
                                        entry.score >= 80 ? '#6366f1' : 
                                        '#f59e0b'
                                    } 
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;