import { EventEmitter } from 'events';

export const FUTURES_SYMBOLS = ['ES=F', 'NQ=F', 'YM=F', 'RTY=F', 'CL=F', 'GC=F', 'ZN=F'];

function basePriceFor(symbol) {
  const seeds = {
    'ES=F': 5200,
    'NQ=F': 18200,
    'YM=F': 39000,
    'RTY=F': 2050,
    'CL=F': 78,
    'GC=F': 2425,
    'ZN=F': 111
  };
  return seeds[symbol] ?? 100;
}

function seededDrift(symbol, tick) {
  const factor = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return Math.sin(tick / 180 + factor) * 0.6;
}

export function createMockQuote(symbol, tick = Date.now()) {
  const baseline = basePriceFor(symbol);
  const drift = seededDrift(symbol, tick);
  const last = baseline + drift;
  return {
    symbol,
    last,
    change: drift,
    changePct: (drift / baseline) * 100,
    high: baseline + Math.abs(drift) * 1.2,
    low: baseline - Math.abs(drift) * 1.1,
    volume: Math.floor(10_000 + (Math.abs(drift) * 8_000) % 9_000),
    timestamp: new Date(tick).toISOString()
  };
}

export class MockMarketStream extends EventEmitter {
  constructor(symbols, intervalMs = 2_000) {
    super();
    this.symbols = symbols;
    this.intervalMs = intervalMs;
    this.timer = null;
  }

  start() {
    this.stop();
    this.timer = setInterval(() => {
      const tick = Date.now();
      this.symbols.forEach((symbol) => {
        this.emit('quote', createMockQuote(symbol, tick));
      });
    }, this.intervalMs);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
