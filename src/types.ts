export type Decision = "BET" | "WATCH" | "NO_BET";
export type Risk = "LOW" | "MODERATE" | "HIGH";

export interface Opportunity {
  id: string;
  sport: string;
  league: string;
  home: string;
  away: string;
  start: string;
  market: string;
  odds: number;
  score: number;
  confidence: number;
  risk: Risk;
  stake: number;
  reasons: string[];
  risks: string[];
  counterArguments: string[];
  sourceStatus: string;
  demo?: boolean;
}

export interface Bankroll {
  initial: number;
  current: number;
  target: number;
  profit: number;
  roi: number;
  bets: number;
  wins: number;
  losses: number;
  drawdown: number;
}
