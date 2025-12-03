import React from 'react';
import { AnalysisResult } from '../types';

interface AnalysisCardProps {
  analysis: AnalysisResult;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysis }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg animate-fade-in">
      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6">
        🔍 스타일 분석 결과
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">톤앤매너 (Tone)</p>
          <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 text-blue-100">
            {analysis.tone}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">타겟 시청자 (Audience)</p>
          <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 text-purple-100">
            {analysis.targetAudience}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">호흡/속도감 (Pacing)</p>
          <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 text-emerald-100">
            {analysis.pacing}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">구성 방식 (Structure)</p>
          <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 text-amber-100">
            {analysis.structure}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">핵심 후킹 요소</p>
          <ul className="list-disc list-inside space-y-1 text-slate-300 text-sm">
            {analysis.keyHooks.map((hook, idx) => (
              <li key={idx}><span className="text-slate-200">{hook}</span></li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">개선 제안 (AI Tips)</p>
          <div className="grid gap-2">
            {analysis.improvementTips.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-indigo-900/20 p-3 rounded border border-indigo-500/20">
                <span className="text-indigo-400 font-bold">#{idx + 1}</span>
                <span className="text-indigo-100 text-sm">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisCard;
