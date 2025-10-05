import { MockMarketStream, createMockQuote, FUTURES_SYMBOLS } from './mockData.js';

const DEFAULT_BASE_URL = 'https://api.topstepx.io';

export class TopstepGatewayService {
  constructor({ baseUrl = DEFAULT_BASE_URL, apiKey = '', useMocks = false } = {}) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.useMocks = useMocks;
    this.mockStreams = new Map();
  }

  listFuturesSymbols() {
    return [...FUTURES_SYMBOLS];
  }

  async fetchQuote(symbol) {
    if (!FUTURES_SYMBOLS.includes(symbol)) {
      throw new Error(`Unsupported symbol: ${symbol}`);
    }

    if (this.useMocks) {
      return createMockQuote(symbol);
    }

    const response = await fetch(`${this.baseUrl}/markets/quote?symbol=${encodeURIComponent(symbol)}`, {
      headers: this.#headers()
    });

    if (!response.ok) {
      throw new Error(`Gateway error ${response.status}`);
    }

    return response.json();
  }

  async fetchSnapshot(symbols = FUTURES_SYMBOLS) {
    const uniqueSymbols = [...new Set(symbols.filter((sym) => FUTURES_SYMBOLS.includes(sym)))];
    if (this.useMocks) {
      const quotes = Object.fromEntries(uniqueSymbols.map((symbol) => [symbol, createMockQuote(symbol)]));
      return { quotes };
    }

    const response = await fetch(`${this.baseUrl}/markets/snapshot`, {
      method: 'POST',
      headers: { ...this.#headers(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbols: uniqueSymbols })
    });

    if (!response.ok) {
      throw new Error(`Gateway error ${response.status}`);
    }

    return response.json();
  }

  createStream(symbols = FUTURES_SYMBOLS) {
    const filtered = symbols.filter((symbol) => FUTURES_SYMBOLS.includes(symbol));
    if (this.useMocks) {
      const mock = new MockMarketStream(filtered);
      this.mockStreams.set(mock, mock);
      return mock;
    }

    throw new Error('Real-time gateway streaming requires WebSocket integration not available offline.');
  }

  stopStream(stream) {
    if (stream && this.mockStreams.has(stream)) {
      stream.stop();
      this.mockStreams.delete(stream);
    }
  }

  #headers() {
    const headers = {};
    if (this.apiKey) {
      headers['x-api-key'] = this.apiKey;
    }
    return headers;
  }
}
