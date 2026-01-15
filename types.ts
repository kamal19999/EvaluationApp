export interface Profile {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
}

export interface EvaluationItem {
  id: number;
  main: string;
  sub: string;
  stat?: { total: number; percent: number; avg: number };
}

export interface EvaluationName {
  id: number;
  main: string;
  sub: string;
}

export interface EvaluationConfig {
  items: EvaluationItem[];
  names: EvaluationName[];
  maxScore: number;
  orgName: string;
  evaluatorName: string;
  logo: string | null;
}

export type Scores = Record<string, number | string>;

export type ScreenState = 'welcome' | 'login' | 'setup' | 'eval' | 'results' | 'blocked' | 'loading';
