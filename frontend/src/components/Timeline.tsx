import type { TimelineEntry } from '../services/marketTypes';

interface TimelineProps {
  entries: TimelineEntry[];
}

export function Timeline({ entries }: TimelineProps) {
  return (
    <div className="timeline">
      <h2>Execution Timeline</h2>
      <ol>
        {entries.map((entry) => (
          <li key={entry.timestamp}>
            <span className="timestamp">{entry.timestamp}</span>
            <div>
              <p className="title">{entry.title}</p>
              <p className="description">{entry.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
