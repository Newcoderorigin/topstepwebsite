import { motion } from 'framer-motion';
import type { MarketQuote } from '../services/marketTypes';

interface InstrumentCardProps {
  quote: MarketQuote;
}

export function InstrumentCard({ quote }: InstrumentCardProps) {
  const { symbol, last, change, changePct, high, low, volume } = quote;
  const isUp = change >= 0;

  return (
    <motion.article
      className={`instrument-card ${isUp ? 'instrument-card--up' : 'instrument-card--down'}`}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <header>
        <h3>{symbol}</h3>
        <span className="instrument-card__price">{last.toFixed(2)}</span>
      </header>
      <p className="instrument-card__change">
        {isUp ? '▲' : '▼'} {change.toFixed(2)} ({changePct.toFixed(2)}%)
      </p>
      <dl className="instrument-card__meta">
        <div>
          <dt>High</dt>
          <dd>{high.toFixed(2)}</dd>
        </div>
        <div>
          <dt>Low</dt>
          <dd>{low.toFixed(2)}</dd>
        </div>
        <div>
          <dt>Volume</dt>
          <dd>{volume.toLocaleString()}</dd>
        </div>
      </dl>
    </motion.article>
  );
}
