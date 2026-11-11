import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Ban, ChevronRight, CircleX, Search, TriangleAlert } from 'lucide-react';
import { usePersistentState } from '../../lib/usePersistentState';
import { useRowResize } from '../../lib/useRowResize';
import type { LogEntry } from './types';
import { entryText } from './preview';
import ConsoleView from './ConsoleView';

type LevelFilter = 'all' | 'log' | 'warn' | 'error';

const FILTERS: { id: LevelFilter; label: string }[] = [
  { id: 'all', label: 'All levels' },
  { id: 'log', label: 'Logs' },
  { id: 'warn', label: 'Warnings' },
  { id: 'error', label: 'Errors' },
];

function matchesLevel(entry: LogEntry, filter: LevelFilter) {
  if (filter === 'all') return true;
  if (filter === 'log') return entry.level !== 'warn' && entry.level !== 'error';
  return entry.level === filter;
}

/** Pixels from the bottom within which new logs keep the list scrolled to the end. */
const STICKY_PX = 24;

interface ConsoleDrawerProps {
  entries: LogEntry[];
  onClear: () => void;
  /** Reports the error count, e.g. so a hidden preview can still flag errors. */
  onErrorCount?: (errors: number) => void;
}

/**
 * Collapsible, resizable console under a live preview. Counts stay visible while
 * collapsed, and a new error re-opens it unless the user closed it themselves.
 * Renders the resize handle as a sibling so it sits directly in the parent column.
 */
export default function ConsoleDrawer({ entries, onClear, onErrorCount }: ConsoleDrawerProps) {
  const [open, setOpen] = usePersistentState('fp:consoleOpen', true);
  const resize = useRowResize('fp:previewConsoleHeight', 220, 96);
  const [filter, setFilter] = useState<LevelFilter>('all');
  const [query, setQuery] = useState('');
  // In a narrow pane the text filter folds into a search button until it's needed.
  const [searching, setSearching] = useState(false);
  const queryRef = useRef<HTMLInputElement>(null);
  const bodyId = useId();
  const bodyRef = useRef<HTMLDivElement>(null);
  const atBottom = useRef(true);
  const closedByUser = useRef(false);

  const counts = useMemo(() => {
    let warn = 0;
    let error = 0;
    for (const e of entries) {
      if (e.level === 'warn') warn += e.count;
      if (e.level === 'error') error += e.count;
    }
    return { warn, error };
  }, [entries]);

  // A new error pops the console open, unless the user collapsed it this session.
  const seenErrors = useRef(counts.error);
  useEffect(() => {
    if (counts.error > seenErrors.current && !open && !closedByUser.current) setOpen(true);
    seenErrors.current = counts.error;
  }, [counts.error, open, setOpen]);

  useEffect(() => onErrorCount?.(counts.error), [counts.error, onErrorCount]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((e) => matchesLevel(e, filter) && (!q || entryText(e).toLowerCase().includes(q)));
  }, [entries, filter, query]);

  // Follow new logs, but don't yank the list away from someone scrolled up reading.
  useLayoutEffect(() => {
    const el = bodyRef.current;
    if (el && atBottom.current) el.scrollTop = el.scrollHeight;
  }, [visible, open]);

  const toggle = () => {
    closedByUser.current = open;
    setOpen(!open);
  };

  return (
    <>
      {open && (
        <div
          className="row-resize"
          role="separator"
          aria-orientation="horizontal"
          aria-label="Resize console"
          tabIndex={0}
          onPointerDown={resize.onPointerDown}
          onKeyDown={resize.onKeyDown}
        />
      )}
      <section
        className={`console-drawer${open ? ' open' : ''}`}
        style={open ? { height: resize.height } : undefined}
        aria-label="Console"
      >
        <div className="console-drawer-header">
          <button type="button" className="console-drawer-toggle" aria-expanded={open} aria-controls={bodyId} onClick={toggle}>
            <ChevronRight size={14} className="console-drawer-caret" aria-hidden />
            Console
            {entries.length > 0 && <span className="console-badge">{entries.length}</span>}
            {counts.warn > 0 && (
              <span className="console-badge tone-warn" aria-label={`${counts.warn} warnings`}>
                <TriangleAlert size={11} aria-hidden /> {counts.warn}
              </span>
            )}
            {counts.error > 0 && (
              <span className="console-badge tone-error" aria-label={`${counts.error} errors`}>
                <CircleX size={11} aria-hidden /> {counts.error}
              </span>
            )}
          </button>
          {open && (
            <div className={`console-drawer-tools${searching || query ? ' searching' : ''}`}>
              <select
                className="console-filter-level"
                aria-label="Filter by level"
                value={filter}
                onChange={(e) => setFilter(e.target.value as LevelFilter)}
              >
                {FILTERS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="icon-btn console-search-toggle"
                aria-label="Filter logs"
                data-tooltip="Filter logs"
                onClick={() => {
                  setSearching(true);
                  requestAnimationFrame(() => queryRef.current?.focus());
                }}
              >
                <Search size={14} />
              </button>
              <input
                ref={queryRef}
                type="search"
                className="console-filter-text"
                placeholder="Filter"
                aria-label="Filter logs"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onBlur={() => setSearching(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setQuery('');
                    e.currentTarget.blur();
                  }
                }}
              />
              <button type="button" className="icon-btn" data-tooltip="Clear console" aria-label="Clear console" onClick={onClear}>
                <Ban size={14} />
              </button>
            </div>
          )}
        </div>
        {open && (
          <div
            id={bodyId}
            ref={bodyRef}
            className="console-drawer-body"
            onScroll={(e) => {
              const el = e.currentTarget;
              atBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < STICKY_PX;
            }}
          >
            <ConsoleView
              entries={visible}
              emptyText={
                entries.length ? (
                  'No logs match the filter.'
                ) : (
                  <>
                    No logs yet. <code>console.log</code> output appears here.
                  </>
                )
              }
            />
          </div>
        )}
      </section>
    </>
  );
}
