import React from 'react';
import { GeneratedScript } from '../types';

interface GeneratedScriptViewProps {
  script: GeneratedScript;
  onReset: () => void;
}

const GeneratedScriptView: React.FC<GeneratedScriptViewProps> = ({ script, onReset }) => {
  const copyToClipboard = () => {
    const text = `Title: ${script.title}\n\nThumbnail: ${script.thumbnailIdea}\n\nHook:\n${script.hook}\n\n${script.sections.map(s => `[${s.header}]\n(Visual: ${s.visualCue || 'N/A'})\n${s.body}`).join('\n\n')}\n\nCTA:\n${script.cta}`;
    navigator.clipboard.writeText(text);
    alert('대본이 클립보드에 복사되었습니다.');
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-2xl animate-fade-in-up">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-slate-900 p-6 border-b border-slate-700">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-white">✨ 생성된 대본</h2>
          <div className="flex gap-2">
            <button 
              onClick={copyToClipboard}
              className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded text-sm transition-colors border border-slate-600"
            >
              복사하기
            </button>
            <button 
              onClick={onReset}
              className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded text-sm transition-colors border border-slate-600"
            >
              새로 만들기
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-slate-900/60 p-4 rounded-lg border-l-4 border-purple-500">
            <span className="text-xs text-purple-400 font-bold uppercase block mb-1">Title</span>
            <p className="text-lg font-semibold text-white">{script.title}</p>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-lg border-l-4 border-blue-500">
             <span className="text-xs text-blue-400 font-bold uppercase block mb-1">Thumbnail Idea</span>
            <p className="text-sm text-slate-300">{script.thumbnailIdea}</p>
          </div>
        </div>
      </div>

      {/* Script Body */}
      <div className="p-6 space-y-8 bg-slate-800">
        
        {/* Hook */}
        <div className="relative pl-6 border-l border-slate-600">
          <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
          <h4 className="text-red-400 font-bold text-sm mb-2 uppercase tracking-wide">00:00 - The Hook</h4>
          <p className="text-white leading-relaxed whitespace-pre-wrap font-medium">{script.hook}</p>
        </div>

        {/* Sections */}
        {script.sections.map((section, idx) => (
          <div key={idx} className="relative pl-6 border-l border-slate-600 pb-2">
            <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-slate-500"></div>
            <h4 className="text-blue-300 font-bold text-sm mb-1 uppercase tracking-wide">{section.header}</h4>
            
            {section.visualCue && (
              <div className="mb-3 bg-slate-900/40 p-2 rounded border border-slate-700/50 inline-block">
                <span className="text-xs text-yellow-500 font-semibold mr-2">🎬 VISUAL:</span>
                <span className="text-xs text-slate-400 italic">{section.visualCue}</span>
              </div>
            )}
            
            <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{section.body}</p>
          </div>
        ))}

        {/* CTA */}
        <div className="relative pl-6 border-l border-slate-600">
          <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
          <h4 className="text-emerald-400 font-bold text-sm mb-2 uppercase tracking-wide">Call To Action</h4>
          <p className="text-white leading-relaxed font-medium">{script.cta}</p>
        </div>

      </div>
    </div>
  );
};

export default GeneratedScriptView;
