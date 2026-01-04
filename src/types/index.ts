// API Types
export interface AnalyzeRequest {
  content: string;
}

export interface AnalyzeResponse {
  feedback: string;
}

export interface ExamplesResponse {
  professional: string;
  policyAlert: string;
  minorIssues: string;
}

export interface ApiError {
  error: string;
}

// Component Types
export type ExampleType = 'professional' | 'policyAlert' | 'minorIssues';

export interface FeedbackState {
  message: string | null;
  isAnalyzing: boolean;
  hasAcknowledged: boolean;
}

// Environment validation
export interface EnvConfig {
  CLAUDE_API_KEY: string;
}
