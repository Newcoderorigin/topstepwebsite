export type InstrumentSymbol = 'ES=F' | 'NQ=F' | 'YM=F' | 'RTY=F' | 'CL=F' | 'GC=F' | 'ZN=F';

export interface MarketQuote {
  symbol: InstrumentSymbol;
  last: number;
  change: number;
  changePct: number;
  high: number;
  low: number;
  volume: number;
  timestamp: string;
}

export interface MarketSnapshot {
  quotes: Record<InstrumentSymbol, MarketQuote>;
}

export interface TimelineEntry {
  timestamp: string;
  title: string;
  description: string;
}

export interface UserNote {
  timestamp: string;
  message: string;
}

export interface UserProfile {
  name: string;
  role: string;
  riskBudget: number;
  dailyDrawLimit: number;
  notes: UserNote[];
  timeline: TimelineEntry[];
}
