import { useMemo } from 'react';
import type { UserProfile } from '../services/marketTypes';

const baseProfile: UserProfile = {
  name: 'Avery Quinn',
  role: 'Futures Strategist',
  riskBudget: 35,
  dailyDrawLimit: 1500,
  notes: [
    { timestamp: '07:45', message: 'Bias long ES until NY open if VWAP holds.' },
    { timestamp: '08:10', message: 'GC rotation underway, tighten stops to 3.2.' }
  ],
  timeline: [
    {
      timestamp: '07:00',
      title: 'Premarket Scan',
      description: 'Vol compression overnight, watch RTY for expansion above 2030.'
    },
    {
      timestamp: '08:30',
      title: 'Data Drop',
      description: 'CPI inline, CL bid emerges. Quant bot flagged mean reversion long.'
    }
  ]
};

export function useUserProfile() {
  return useMemo(() => baseProfile, []);
}
