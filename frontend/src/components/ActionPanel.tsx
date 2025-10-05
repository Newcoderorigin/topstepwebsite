import { motion } from 'framer-motion';
import type { UserProfile } from '../services/marketTypes';

interface ActionPanelProps {
  profile: UserProfile;
}

export function ActionPanel({ profile }: ActionPanelProps) {
  return (
    <aside className="action-panel">
      <motion.div className="action-panel__card" layout transition={{ duration: 0.4 }}>
        <h2>{profile.name}'s Playbook</h2>
        <p className="action-panel__subtitle">{profile.role}</p>
        <div className="action-panel__stats">
          <div>
            <span className="label">Risk Budget</span>
            <span className="value">{profile.riskBudget}%</span>
          </div>
          <div>
            <span className="label">Daily Draw</span>
            <span className="value">${profile.dailyDrawLimit.toLocaleString()}</span>
          </div>
          <div>
            <span className="label">Hit Rate Target</span>
            <span className="value">55–61%</span>
          </div>
        </div>
        <button className="cta cta--primary">Deploy Quant Recon</button>
        <button className="cta cta--ghost">Queue Risk Check</button>
      </motion.div>
      <div className="action-panel__log">
        <h3>Live Notes</h3>
        <ul>
          {profile.notes.map((note) => (
            <li key={note.timestamp}>
              <span className="timestamp">{note.timestamp}</span>
              <span>{note.message}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
