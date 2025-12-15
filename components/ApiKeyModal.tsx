import React, { useState, useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
  currentKey: string;
}

const ApiKeyModal: React.FC<Props> = ({ isOpen, onClose, onSave, currentKey }) => {
  const [key, setKey] = useState(currentKey);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setKey(currentKey);
  }, [currentKey, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(key);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-slate-900/60 transition-opacity backdrop-blur-sm" onClick={onClose} aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-slate-100">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 flex items-center justify-between">
             <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                配置 AI 密钥
             </h3>
             <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
             </button>
          </div>

          <div className="px-6 py-6">
             <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                为了激活智能画像与深度诊断功能，您需要提供 Google Gemini API Key。您的密钥仅存储在本地浏览器中，绝不会上传至服务器。
             </p>

             <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="apiKey" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        API Key
                    </label>
                    <div className="relative">
                        <input
                            type={isVisible ? "text" : "password"}
                            id="apiKey"
                            className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all font-mono text-sm"
                            placeholder="AIzaSy..."
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            autoFocus
                        />
                        <button
                            type="button"
                            onClick={() => setIsVisible(!isVisible)}
                            className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-600"
                        >
                            {isVisible ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            )}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                    <a 
                        href="https://aistudio.google.com/app/apikey" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1"
                    >
                        获取免费 API Key
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                    <div className="flex gap-3">
                         {currentKey && (
                             <button
                                type="button"
                                onClick={() => { setKey(''); onSave(''); }}
                                className="px-4 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                             >
                                清除
                             </button>
                         )}
                        <button
                            type="submit"
                            disabled={!key.trim()}
                            className="px-6 py-2 bg-slate-800 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-300 hover:bg-slate-700 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            保存配置
                        </button>
                    </div>
                </div>
             </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;