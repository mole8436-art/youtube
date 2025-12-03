import React, { useState } from 'react';
import { analyzeScript, generateNewScript, generateVideoIdeas } from './services/geminiService';
import AnalysisCard from './components/AnalysisCard';
import GeneratedScriptView from './components/GeneratedScriptView';
import { AnalysisResult, GeneratedScript, AppState } from './types';

const App: React.FC = () => {
  // State
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [inputScript, setInputScript] = useState<string>('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  
  // Generation State
  const [newTopic, setNewTopic] = useState<string>('');
  const [extraInstructions, setExtraInstructions] = useState<string>('');
  const [generatedScript, setGeneratedScript] = useState<GeneratedScript | null>(null);
  
  // Idea Generation State
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState<boolean>(false);
  const [ideas, setIdeas] = useState<string[]>([]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handlers
  const handleAnalyze = async () => {
    if (!inputScript.trim()) {
      alert("분석할 대본을 입력해주세요.");
      return;
    }
    setAppState(AppState.ANALYZING);
    setErrorMessage(null);
    try {
      const result = await analyzeScript(inputScript);
      setAnalysis(result);
      setAppState(AppState.ANALYZED);
    } catch (error) {
      console.error(error);
      setErrorMessage("대본 분석 중 오류가 발생했습니다. API 키를 확인하거나 잠시 후 다시 시도해주세요.");
      setAppState(AppState.ERROR);
    }
  };

  const handleGenerateIdeas = async () => {
    if (!analysis) return;
    setIsGeneratingIdeas(true);
    setErrorMessage(null);
    try {
      const result = await generateVideoIdeas(analysis);
      setIdeas(result);
    } catch (error) {
      console.error(error);
      setErrorMessage("아이디어 생성 중 오류가 발생했습니다.");
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  const handleGenerate = async () => {
    if (!analysis || !newTopic.trim()) {
      alert("새로운 주제를 입력해주세요.");
      return;
    }
    setAppState(AppState.GENERATING);
    setErrorMessage(null);
    try {
      const result = await generateNewScript(analysis, newTopic, extraInstructions);
      setGeneratedScript(result);
      setAppState(AppState.COMPLETED);
    } catch (error) {
      console.error(error);
      setErrorMessage("대본 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      setAppState(AppState.ERROR); // Go back to analyzed state but show error? Or error state.
    }
  };

  const resetAll = () => {
    setAppState(AppState.IDLE);
    setInputScript('');
    setAnalysis(null);
    setNewTopic('');
    setIdeas([]);
    setGeneratedScript(null);
    setErrorMessage(null);
  };

  const resetGeneration = () => {
    setAppState(AppState.ANALYZED);
    setGeneratedScript(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-purple-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={resetAll}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              튜브지니어스
            </h1>
          </div>
          <div className="text-sm text-slate-500">Powered by Gemini 2.5 & 3.0</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Error Display */}
        {errorMessage && (
           <div className="mb-6 bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded-lg flex items-center gap-3">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
             </svg>
             {errorMessage}
           </div>
        )}

        {/* Phase 1: Input & Analysis */}
        {(appState === AppState.IDLE || appState === AppState.ANALYZING || appState === AppState.ERROR) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">1. 레퍼런스 대본 입력</h2>
                <p className="text-slate-400">분석하고 싶은 성공적인 유튜브 영상의 대본을 붙여넣으세요. 스타일과 구조를 학습합니다.</p>
              </div>
              <div className="flex-grow">
                <textarea
                  value={inputScript}
                  onChange={(e) => setInputScript(e.target.value)}
                  placeholder="여기에 대본 내용을 붙여넣으세요 (스크립트 전문)..."
                  className="w-full h-96 lg:h-[600px] bg-slate-800 border border-slate-700 rounded-xl p-6 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all placeholder:text-slate-600 font-mono text-sm leading-relaxed"
                />
              </div>
            </div>

            <div className="flex flex-col justify-center items-center p-8 lg:p-12 bg-slate-800/50 rounded-xl border border-slate-800 border-dashed">
              {appState === AppState.ANALYZING ? (
                <div className="text-center space-y-6">
                  <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl">🧠</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Gemini가 분석 중입니다...</h3>
                    <p className="text-slate-400">톤, 매너, 구조, 시청자 반응 요소를 파악하고 있습니다.</p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6 max-w-md">
                   <div className="w-20 h-20 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center border border-slate-700 shadow-xl">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-slate-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                      </svg>
                   </div>
                   <div>
                     <h3 className="text-xl font-bold text-white mb-2">준비되셨나요?</h3>
                     <p className="text-slate-400 mb-6">대본을 입력하고 버튼을 누르면 AI가 크리에이터의 DNA를 분석합니다.</p>
                     <button
                        onClick={handleAnalyze}
                        disabled={!inputScript.trim()}
                        className="w-full py-4 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-lg border border-white/10"
                      >
                        ⚡ 스타일 분석 시작하기
                      </button>
                   </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Phase 2: Analysis Result & Generation Input */}
        {(appState === AppState.ANALYZED || appState === AppState.GENERATING) && analysis && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Analysis Result */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">2. 분석 리포트</h2>
                <button 
                  onClick={resetAll} 
                  className="text-sm text-slate-500 hover:text-slate-300 underline"
                >
                  처음으로
                </button>
              </div>
              <AnalysisCard analysis={analysis} />
              
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <p className="text-slate-400 text-sm">
                  💡 이 분석 데이터를 기반으로 Gemini 3 Pro가 새로운 대본을 작성합니다.
                </p>
              </div>
            </div>

            {/* Right: Generation Form */}
            <div className="lg:col-span-7 flex flex-col gap-6">
               <h2 className="text-2xl font-bold text-white">3. 새 대본 만들기</h2>
               
               <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 lg:p-8 shadow-xl flex flex-col gap-6 h-full">
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <label className="text-sm font-semibold text-slate-300 uppercase tracking-wide">새로운 주제 (Topic)</label>
                      <button 
                        onClick={handleGenerateIdeas}
                        disabled={isGeneratingIdeas}
                        className="text-xs flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50"
                      >
                        {isGeneratingIdeas ? (
                           <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin"></div>생성 중...</span>
                        ) : (
                           <>✨ 주제가 떠오르지 않나요? <span className="underline">AI 아이디어 추천</span></>
                        )}
                      </button>
                    </div>

                    {/* Ideas Chips */}
                    {ideas.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2 animate-fade-in">
                        {ideas.map((idea, idx) => (
                          <button
                            key={idx}
                            onClick={() => setNewTopic(idea)}
                            className="text-xs bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 text-purple-200 px-3 py-1.5 rounded-full transition-colors text-left"
                          >
                            + {idea}
                          </button>
                        ))}
                      </div>
                    )}

                    <input 
                      type="text" 
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                      placeholder="예: '집에서 5분 만에 할 수 있는 고강도 운동'" 
                      className="w-full bg-slate-900 border border-slate-600 rounded-lg p-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300 uppercase tracking-wide">추가 요청사항 (Optional)</label>
                    <textarea 
                      value={extraInstructions}
                      onChange={(e) => setExtraInstructions(e.target.value)}
                      placeholder="예: '조금 더 유머러스하게 작성해줘', '결론에 구독 요청을 강하게 넣어줘'" 
                      className="w-full h-32 bg-slate-900 border border-slate-600 rounded-lg p-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="mt-auto pt-4">
                    {appState === AppState.GENERATING ? (
                      <button disabled className="w-full py-4 bg-slate-700 text-slate-300 font-bold rounded-xl cursor-wait flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        창작의 고통을 겪는 중... (약 10-20초)
                      </button>
                    ) : (
                      <button 
                        onClick={handleGenerate}
                        disabled={!newTopic.trim()}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/20 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                      >
                        ✨ AI 대본 생성하기
                      </button>
                    )}
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* Phase 3: Result View */}
        {appState === AppState.COMPLETED && generatedScript && (
          <div className="max-w-4xl mx-auto">
            <GeneratedScriptView script={generatedScript} onReset={resetGeneration} />
          </div>
        )}
        
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 mt-12 bg-slate-950">
        <div className="container mx-auto px-4 text-center text-slate-600 text-sm">
          &copy; {new Date().getFullYear()} TubeGenius Studio. Built with React & Google Gemini.
        </div>
      </footer>
    </div>
  );
};

export default App;