export interface TesterAccount {
  id: string;
  userId?: string;
  email: string;
  fullName: string;
  passwordPlain: string;
  maxCharts: number;
  maxQuestionsPerChart: number;
  isActive: boolean;
  notes?: string;
  chartsUsed?: number;
  questionsUsed?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TesterConfig {
  isTester: boolean;
  maxCharts: number;
  maxQuestionsPerChart: number;
  chartsUsed: number;
  fullName?: string;
  notes?: string;
}
