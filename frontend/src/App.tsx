import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMarketStream } from './hooks/useMarketStream';
import { InstrumentCard } from './components/InstrumentCard';
import { ActionPanel } from './components/ActionPanel';
import { Timeline } from './components/Timeline';
import { useUserProfile } from './hooks/useUserProfile';
import './styles/layout.css';

const heroGradient = {
  background:
    'radial-gradient(120% 120% at 90% 10%, rgba(76, 0, 255, 0.8) 0%, rgba(15, 12, 41, 0.9) 40%, rgba(36, 36, 62, 0.95) 70%, rgba(10, 10, 15, 1) 100%)'
};

const instruments = ['ES=F', 'NQ=F', 'YM=F', 'RTY=F', 'CL=F', 'GC=F', 'ZN=F'] as const;

function App() {
  const { quotes, status } = useMarketStream(instruments);
  const profile = useUserProfile();

  const sortedQuotes = useMemo(
    () =>
      instruments
        .map((symbol) => quotes[symbol])
        .filter(Boolean)
        .sort((a, b) => a.symbol.localeCompare(b.symbol)),
    [quotes]
  );

  return (
    <div className="app-root">
      <header className="hero" style={heroGradient}>
        <div className="hero__content">
          <p className="eyebrow">TopstepX Gateway</p>
          <h1>Command your edge in the futures arena.</h1>
          <p className="lede">
            Fuse real-time market intelligence with disciplined risk overlays. Elevate your trading by
            tracking curated TopstepX futures streams and launching playbooks with surgical precision.
          </p>
          <div className="cta-group">
            <a className="cta cta--primary" href="#launch">
              Launch Trading Desk
            </a>
            <a className="cta cta--ghost" href="#learn">
              Review Playbooks
            </a>
          </div>
        </div>
        <AnimatePresence>
          <motion.div
            className="hero__orb"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </AnimatePresence>
      </header>

      <main>
        <section id="launch" className="dashboard">
          <div className="dashboard__left">
            <div className="panel">
              <div className="panel__header">
                <h2>Futures Pulse</h2>
                <span className={`status status--${status}`}>{status.toUpperCase()}</span>
              </div>
              <div className="panel__grid">
                {sortedQuotes.map((quote) => (
                  <InstrumentCard key={quote.symbol} quote={quote} />
                ))}
              </div>
            </div>

            <Timeline entries={profile.timeline} />
          </div>
          <ActionPanel profile={profile} />
        </section>

        <section id="learn" className="playbooks">
          <div className="playbooks__card">
            <h3>Risk Canvas</h3>
            <p>
              Set guardrails before you launch. Configure product limits, daily draw, and performance drift
              controls tied to your evaluation plan.
            </p>
          </div>
          <div className="playbooks__card">
            <h3>Signal Intelligence</h3>
            <p>
              Deploy the quant bot API to scout setups targeting a 55–61% hit rate. Backtesting hooks and
              telemetry keep the model honest.
            </p>
          </div>
          <div className="playbooks__card">
            <h3>Execution Modes</h3>
            <p>
              Simulate, shadow, or go live. Each mode routes through the broker gateway while logging every
              decision for compliance review.
            </p>
          </div>
        </section>
      </main>

      <footer>
        <p>© {new Date().getFullYear()} TopstepX Experimental Command Center</p>
      </footer>
    </div>
  );
}

export default App;
