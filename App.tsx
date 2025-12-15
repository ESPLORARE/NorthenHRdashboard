import React, { useState, useEffect } from 'react';
import { Employee, AnalyzedEmployee } from './types';
import { calculateEmployeeScore } from './utils/scoring';
import { analyzeEmployeeData } from './services/geminiService';
import EmployeeCard from './components/EmployeeCard';
import EmployeeDetailModal from './components/EmployeeDetailModal';
import Dashboard from './components/Dashboard';
import ApiKeyModal from './components/ApiKeyModal';

const App: React.FC = () => {
  const [employees, setEmployees] = useState<AnalyzedEmployee[]>([]);
  const [view, setView] = useState<'upload' | 'dashboard' | 'cards'>('upload');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<AnalyzedEmployee | null>(null);
  
  // API Key State
  const [apiKey, setApiKey] = useState<string>('');
  const [showKeyModal, setShowKeyModal] = useState(false);

  // Load key from local storage on mount
  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
        setApiKey(storedKey);
    }
  }, []);

  const handleSaveKey = (key: string) => {
      setApiKey(key);
      if (key) {
          localStorage.setItem('gemini_api_key', key);
      } else {
          localStorage.removeItem('gemini_api_key');
      }
      setShowKeyModal(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        let rawData: Employee[] = [];
        try {
            rawData = JSON.parse(text);
        } catch (err) {
            try { rawData = JSON.parse(`[${text}]`); } 
            catch (err2) {
                console.error("Failed to parse JSON", err2);
                alert("JSON 格式错误。请确保文件包含有效的员工 JSON 数组。");
                return;
            }
        }
        
        if (!Array.isArray(rawData)) rawData = [rawData as unknown as Employee];

        // Instant scoring calculation (No AI wait)
        const processedData: AnalyzedEmployee[] = rawData.map((emp, index) => ({
            ...emp,
            序号: emp.序号 || index + 1,
            calculatedScore: calculateEmployeeScore(emp)
        }));

        setEmployees(processedData);
        setView('dashboard');
        setSearchTerm(''); 
      } catch (error) {
        console.error("Error processing file", error);
        alert("处理文件时出错。");
      }
    };
    reader.readAsText(file);
  };

  const handleAnalyzeEmployee = async (emp: AnalyzedEmployee) => {
    // Check for API Key
    if (!apiKey) {
        setShowKeyModal(true);
        // We pause the analysis request here. 
        // User needs to save key and then trigger analysis again (or we could auto-trigger, but simple is better).
        return; 
    }

    // Optimistic update to show loading state
    setEmployees(prev => prev.map(e => e.序号 === emp.序号 ? { ...e, isAnalyzing: true } : e));
    setSelectedEmployee(prev => prev && prev.序号 === emp.序号 ? { ...prev, isAnalyzing: true } : prev);

    // Call API with the key
    const analysis = await analyzeEmployeeData(emp, apiKey);

    // Update state with result
    const updatedEmp = { ...emp, aiAnalysis: analysis, isAnalyzing: false };
    
    setEmployees(prev => prev.map(e => e.序号 === emp.序号 ? updatedEmp : e));
    // Update modal data if it's still open
    setSelectedEmployee(prev => prev && prev.序号 === emp.序号 ? updatedEmp : prev);
  };

  const filteredEmployees = employees.filter(emp => {
    const term = searchTerm.toLowerCase();
    return (
      emp.基本信息.姓名.toLowerCase().includes(term) ||
      String(emp.序号).includes(term) ||
      (emp.aiAnalysis?.persona || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navbar with Glassmorphism */}
      <nav className="fixed w-full top-0 z-40 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-emerald-500 to-teal-400 p-2 rounded-xl shadow-lg shadow-emerald-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-800">
                北区人员<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 ml-1">智能看板</span>
              </span>
            </div>
            
            <div className="flex items-center gap-4">
                {employees.length > 0 && (
                <div className="flex items-center space-x-1 bg-slate-100/50 p-1 rounded-lg border border-slate-200/50">
                    <button
                    onClick={() => setView('dashboard')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${view === 'dashboard' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                    看板
                    </button>
                    <button
                    onClick={() => setView('cards')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${view === 'cards' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                    卡片
                    </button>
                    <div className="w-px h-4 bg-slate-300 mx-1"></div>
                    <button
                    onClick={() => { setEmployees([]); setView('upload'); setSearchTerm(''); }}
                    className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-400 hover:text-red-500 transition-colors"
                    >
                    重置
                    </button>
                </div>
                )}

                {/* API Key Status Button */}
                <button 
                    onClick={() => setShowKeyModal(true)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        apiKey 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100' 
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-700'
                    }`}
                >
                    <span className={`w-2 h-2 rounded-full ${apiKey ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                    {apiKey ? 'AI 密钥已配置' : '配置 AI 密钥'}
                </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
        
        {view === 'upload' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in-up">
            <div className="bg-white p-12 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 max-w-2xl w-full text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500"></div>
              
              <div className="mb-8 mx-auto bg-gradient-to-br from-emerald-50 to-teal-50 w-24 h-24 rounded-3xl flex items-center justify-center shadow-inner border border-emerald-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              
              <h1 className="text-3xl font-bold text-slate-800 mb-3 tracking-tight">上传人员数据</h1>
              <p className="text-slate-500 mb-10 max-w-md mx-auto leading-relaxed">
                请上传包含北区人员记录的 JSON 数据文件。系统将自动进行多维能力评估与 AI 智能画像分析。
              </p>
              
              <label className="group block w-full cursor-pointer relative">
                  <input type="file" className="hidden" accept=".json" onChange={handleFileUpload} />
                  <div className="w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl group-hover:border-emerald-400 group-hover:bg-emerald-50/30 transition-all duration-300 flex flex-col items-center justify-center gap-2">
                    <span className="text-sm font-semibold text-slate-500 group-hover:text-emerald-600 transition-colors">
                        点击或拖拽上传 JSON 文件
                    </span>
                    <span className="text-xs text-slate-400 group-hover:text-emerald-500/70">支持 .json 格式</span>
                  </div>
              </label>
            </div>
          </div>
        )}

        {view === 'dashboard' && employees.length > 0 && (
          <Dashboard employees={employees} />
        )}

        {view === 'cards' && employees.length > 0 && (
          <div className="space-y-8 animate-fade-in">
             <div className="max-w-xl mx-auto relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl leading-5 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm group-hover:shadow-md"
                  placeholder="搜索姓名、ID 或 AI 画像标签..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees.map((emp) => (
                <div key={emp.序号}>
                  <EmployeeCard 
                    data={emp} 
                    onClick={() => setSelectedEmployee(emp)}
                  />
                </div>
              ))}
              {filteredEmployees.length === 0 && (
                 <div className="col-span-full flex flex-col items-center justify-center text-slate-400 py-24">
                     <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                     </div>
                     <p className="text-lg font-medium">未找到匹配的人员</p>
                 </div>
              )}
            </div>
          </div>
        )}
        
        {/* Detail Modal */}
        <EmployeeDetailModal 
            employee={selectedEmployee} 
            onClose={() => setSelectedEmployee(null)} 
            onAnalyze={handleAnalyzeEmployee}
        />

        {/* API Key Modal */}
        <ApiKeyModal 
            isOpen={showKeyModal} 
            onClose={() => setShowKeyModal(false)}
            onSave={handleSaveKey}
            currentKey={apiKey}
        />
      </main>
    </div>
  );
};

export default App;