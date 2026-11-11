import { Fragment, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router';
import {
  Binary,
  Braces,
  CheckCircle2,
  CircleDot,
  CornerDownLeft,
  FolderTree,
  LayoutGrid,
  ListChecks,
  Search,
  StickyNote,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { DifficultyBadge } from '../../components/Badges';
import { Modal } from '../../components/overlay/Modal';
import { useProgress } from '../../lib/progress';
import { readRecent } from '../../lib/recent';
import { buildIndex, suggestions, type PaletteAction, type PaletteItem, type PaletteSection } from './paletteIndex';
import { rankItems, toSections, type Range } from './rank';
import './palette.css';

const TRACK_ICONS: Record<string, LucideIcon> = { js: Braces, dsa: Binary, 'machine-coding': LayoutGrid };
const KIND_ICONS: Record<PaletteItem['kind'], LucideIcon> = {
  question: Braces,
  topic: FolderTree,
  deck: ListChecks,
  note: StickyNote,
  action: Zap,
};

function iconOf(item: PaletteItem): LucideIcon {
  if (item.kind === 'action') return (item as PaletteAction).icon ?? Zap;
  if (item.question) return TRACK_ICONS[item.question.track] ?? Braces;
  return KIND_ICONS[item.kind];
}

/** The title with matched ranges wrapped in <mark>. */
function Highlighted({ text, ranges }: { text: string; ranges: Range[] }) {
  if (!ranges.length) return <>{text}</>;
  const parts = [];
  let at = 0;
  ranges.forEach(([start, end], i) => {
    if (start > at) parts.push(<Fragment key={`t${i}`}>{text.slice(at, start)}</Fragment>);
    parts.push(<mark key={`m${i}`}>{text.slice(start, end)}</mark>);
    at = end;
  });
  if (at < text.length) parts.push(<Fragment key="rest">{text.slice(at)}</Fragment>);
  return <>{parts}</>;
}

interface Row {
  item: PaletteItem;
  ranges: Range[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  actions: PaletteAction[];
  /** Shown before you type, after Continue and Recent. */
  jumpTo: PaletteItem[];
}

/**
 * Spotlight-style launcher: find any question, topic, quiz deck or note, or
 * run an action (prefix `>`). Before you type it suggests what to pick up next.
 */
export default function CommandPalette({ open, onClose, actions, jumpTo }: Props) {
  const navigate = useNavigate();
  const progress = useProgress();
  // Kept across open/close: reopening shows the last query, selected, like Spotlight.
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const optionId = (i: number) => `${listId}-opt-${i}`;

  const items = useMemo(() => [...buildIndex(), ...actions], [actions]);

  const sections = useMemo((): (PaletteSection & { rows: Row[] })[] => {
    if (!open) return [];
    if (!query.trim()) {
      return suggestions(items, progress, readRecent(), jumpTo).map((s) => ({
        ...s,
        rows: s.items.map((item) => ({ item, ranges: [] })),
      }));
    }
    const boost = (i: PaletteItem) => (i.question && progress[i.question.slug] === 'attempted' ? 3 : 0);
    return toSections(rankItems(query, items, { boost })).map((s) => ({ ...s, rows: s.hits }));
  }, [open, query, items, progress, jumpTo]);

  const rows = useMemo(() => sections.flatMap((s) => s.rows), [sections]);
  const activeIndex = Math.min(active, Math.max(rows.length - 1, 0));

  useEffect(() => {
    if (open) inputRef.current?.select();
  }, [open]);

  useEffect(() => {
    document.getElementById(`${listId}-opt-${activeIndex}`)?.scrollIntoView({ block: 'nearest' });
  }, [listId, activeIndex]);

  const choose = (item: PaletteItem | undefined) => {
    if (!item) return;
    onClose();
    const run = (item as PaletteAction).run;
    if (run) run();
    else if (item.href) navigate(item.href);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!rows.length) return;
      const step = e.key === 'ArrowDown' ? 1 : -1;
      setActive((activeIndex + step + rows.length) % rows.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(rows[activeIndex]?.item);
    } else if (e.key === 'Escape' && query) {
      // First Esc clears, the next one closes (the dialog's own cancel).
      e.preventDefault();
      setQuery('');
      setActive(0);
    }
  };

  let rowIndex = -1;
  const empty = query.trim() && rows.length === 0;

  return (
    <Modal open={open} onClose={onClose} label="Search" placement="top" className="palette" initialFocus={inputRef}>
      <div className="modal-panel palette-panel">
        <div className="palette-search">
          <Search size={18} className="palette-search-icon" aria-hidden />
          <input
            ref={inputRef}
            className="palette-input"
            type="text"
            role="combobox"
            aria-expanded={rows.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={rows.length ? optionId(activeIndex) : undefined}
            aria-label="Search questions, topics, quizzes and notes"
            placeholder="Search questions, topics, quizzes, notes…"
            spellCheck={false}
            autoComplete="off"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
          />
          <kbd className="kbd palette-esc" aria-hidden>
            esc
          </kbd>
        </div>

        <div className="palette-results" id={listId} role="listbox" aria-label="Results">
          {sections.map((section) => (
            <div key={section.id} role="group" aria-labelledby={`${listId}-${section.id}`} className="palette-group">
              <div id={`${listId}-${section.id}`} className="palette-group-label" role="presentation">
                {section.label}
              </div>
              {section.rows.map(({ item, ranges }) => {
                rowIndex += 1;
                const i = rowIndex;
                const Icon = iconOf(item);
                const status = item.question ? progress[item.question.slug] : undefined;
                const kbd = (item as PaletteAction).kbd;
                return (
                  <div
                    key={item.id}
                    id={optionId(i)}
                    role="option"
                    aria-selected={i === activeIndex}
                    className={`palette-row${i === activeIndex ? ' active' : ''}`}
                    // Movement, not hover: a still pointer mustn't steal the selection while the list scrolls.
                    onPointerMove={() => i !== activeIndex && setActive(i)}
                    onClick={() => choose(item)}
                  >
                    <Icon size={16} className="palette-row-icon" aria-hidden />
                    <span className="palette-row-text">
                      <span className="palette-row-title">
                        <Highlighted text={item.title} ranges={ranges} />
                      </span>
                      {item.subtitle && <span className="palette-row-subtitle">{item.subtitle}</span>}
                    </span>
                    <span className="palette-row-meta">
                      {status === 'solved' && <CheckCircle2 size={14} className="status-solved" aria-label="Solved" />}
                      {status === 'attempted' && <CircleDot size={14} className="status-attempted" aria-label="Attempted" />}
                      {item.question && <DifficultyBadge difficulty={item.question.difficulty} />}
                      {kbd && <kbd className="kbd">{kbd}</kbd>}
                      <CornerDownLeft size={14} className="palette-enter" aria-hidden />
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
          {empty && (
            <p className="palette-empty">
              No matches for “{query.trim()}”. Try a tag (<code>graph</code>, <code>dp</code>) or a track (<code>dsa</code>).
            </p>
          )}
        </div>

        <div className="palette-footer" aria-hidden>
          <span>
            <kbd className="kbd">↑</kbd>
            <kbd className="kbd">↓</kbd> navigate
          </span>
          <span>
            <kbd className="kbd">↵</kbd> open
          </span>
          <span>
            <kbd className="kbd">esc</kbd> {query ? 'clear' : 'close'}
          </span>
          <span className="palette-footer-hint">
            Type <kbd className="kbd">&gt;</kbd> for actions
          </span>
        </div>
        <div className="sr-only" aria-live="polite">
          {query.trim() ? `${rows.length} result${rows.length === 1 ? '' : 's'}` : ''}
        </div>
      </div>
    </Modal>
  );
}
