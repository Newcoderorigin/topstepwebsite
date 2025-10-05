import { useEffect, useRef, useState } from 'react';
import type { MarketQuote, MarketSnapshot, InstrumentSymbol } from '../services/marketTypes';

interface MarketStreamState {
  quotes: Record<string, MarketQuote>;
  status: 'idle' | 'syncing' | 'live' | 'offline';
}

export function useMarketStream(symbols: readonly InstrumentSymbol[]) {
  const [state, setState] = useState<MarketStreamState>({ quotes: {}, status: 'idle' });
  const retryRef = useRef<number>();

  useEffect(() => {
    let cancelled = false;
    let ws: WebSocket | null = null;

    async function bootstrap() {
      setState((prev) => ({ ...prev, status: 'syncing' }));
      try {
        const response = await fetch('/api/markets/snapshot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbols })
        });
        const snapshot: MarketSnapshot = await response.json();
        if (cancelled) return;
        setState({ quotes: snapshot.quotes, status: 'live' });
      } catch (error) {
        console.error('snapshot failed', error);
        setState((prev) => ({ ...prev, status: 'offline' }));
      }
    }

    function connectSocket() {
      const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
      try {
        ws = new WebSocket(`${protocol}://${window.location.host}/api/markets/stream`);
        ws.onopen = () => {
          ws?.send(JSON.stringify({ type: 'subscribe', symbols }));
        };
        ws.onmessage = (event) => {
          const payload = JSON.parse(event.data) as MarketQuote;
          setState((prev) => ({
            quotes: { ...prev.quotes, [payload.symbol]: payload },
            status: 'live'
          }));
        };
        ws.onclose = () => {
          setState((prev) => ({ ...prev, status: 'offline' }));
          retryRef.current = window.setTimeout(connectSocket, 5_000);
        };
        ws.onerror = () => {
          ws?.close();
        };
      } catch (error) {
        console.error('socket error', error);
      }
    }

    bootstrap().then(connectSocket);

    return () => {
      cancelled = true;
      if (retryRef.current) window.clearTimeout(retryRef.current);
      ws?.close();
    };
  }, [symbols]);

  return state;
}
