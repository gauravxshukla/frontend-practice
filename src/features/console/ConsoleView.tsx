import { useMemo, type ReactNode } from 'react';
import { Bug, CircleX, Info, TriangleAlert, type LucideIcon } from 'lucide-react';
import type { LogEntry, LogLevel } from './types';
import { groupRepeats } from './groupRepeats';
import ValueInspector from './ValueInspector';
import './console.css';

const ICONS: Record<LogLevel, LucideIcon | null> = {
  log: null,
  info: Info,
  warn: TriangleAlert,
  error: CircleX,
  debug: Bug,
};

function LogRow({ entry }: { entry: LogEntry }) {
  const Icon = ICONS[entry.level];
  return (
    <div className={`log-row log-${entry.level}`}>
      <span className="log-icon">{Icon && <Icon size={13} aria-label={entry.level} />}</span>
      <div className="log-args">
        {entry.args.map((arg, i) => (
          <ValueInspector key={i} value={arg} top />
        ))}
      </div>
      {entry.count > 1 && (
        <span className="log-count" aria-label={`repeated ${entry.count} times`}>
          {entry.count}
        </span>
      )}
    </div>
  );
}

interface ConsoleViewProps {
  entries: LogEntry[];
  /** Tighter rows for the DSA result panel's per-testcase stdout. */
  compact?: boolean;
  emptyText?: ReactNode;
}

/** A list of console entries with identical consecutive logs grouped. */
export default function ConsoleView({ entries, compact = false, emptyText = 'No logs yet.' }: ConsoleViewProps) {
  const rows = useMemo(() => groupRepeats(entries), [entries]);
  return (
    <div className={`console-view${compact ? ' compact' : ''}`} role="log" aria-live="polite">
      {rows.length ? rows.map((entry) => <LogRow key={entry.id} entry={entry} />) : <p className="console-empty">{emptyText}</p>}
    </div>
  );
}
