export interface AnalysisResult {
  tone: string;
  targetAudience: string;
  pacing: string;
  structure: string;
  keyHooks: string[];
  improvementTips: string[];
}

export interface ScriptSection {
  header: string;
  body: string;
  visualCue?: string;
}

export interface GeneratedScript {
  title: string;
  thumbnailIdea: string;
  hook: string;
  sections: ScriptSection[];
  cta: string;
}

export enum AppState {
  IDLE,
  ANALYZING,
  ANALYZED,
  GENERATING,
  COMPLETED,
  ERROR
}
