import { useEffect, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { Link, useLocation } from 'react-router';
import {
  Atom,
  Binary,
  Braces,
  CheckCircle2,
  ChevronRight,
  Code2,
  FileCode,
  LayoutGrid,
  ListChecks,
  Monitor,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  StickyNote,
  Sun,
  X,
  type LucideIcon,
} from 'lucide-react';
import { getQuestion, questionsIn, questionTree, type QuestionGroup } from '../lib/content/catalog';
import { noteSections, notes } from '../lib/content/notes';
import { quizDecks } from '../lib/content/quiz';
import { useProgress } from '../lib/progress';
import { useTheme, type ThemeMode } from '../lib/theme';
import { usePersistentState } from '../lib/usePersistentState';
import { Kbd } from '../components/Kbd';
import './sidebar.css';

const GROUP_ICONS: Record<string, LucideIcon> = {
  js: Braces,
  dsa: Binary,
  'machine-coding': LayoutGrid,
  'machine-coding/react': Atom,
  'machine-coding/vanilla': FileCode,
};

const SECTIONS = [
  { id: 'questions', label: 'Questions', icon: Code2 },
  { id: 'quiz', label: 'Quiz', icon: ListChecks },
  { id: 'notes', label: 'Notes', icon: StickyNote },
] as const;

const THEME_OPTIONS: { mode: ThemeMode; label: string; icon: LucideIcon }[] = [
  { mode: 'system', label: 'System', icon: Monitor },
  { mode: 'light', label: 'Light', icon: Sun },
  { mode: 'dark', label: 'Dark', icon: Moon },
];

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onExpand: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  filter: string;
  onFilterChange: (value: string) => void;
  filterRef: RefObject<HTMLInputElement | null>;
}

/**
 * Where the current route sits in the tree: which topic leaf is active and which
 * groups must be open to show it. Questions resolve to their topic.
 */
function locate(pathname: string): { activeLeaf?: string; open: string[] } {
  const topicOpen = (groupId: string) => {
    const parent = groupId.includes('/') ? [`questions/${groupId.split('/')[0]}`] : [];
    return { activeLeaf: `topic:${groupId}`, open: ['questions', ...parent] };
  };
  if (pathname.startsWith('/q/')) {
    const q = getQuestion(pathname.slice(3));
    return q ? topicOpen(q.groupId) : { open: ['questions'] };
  }
  if (pathname.startsWith('/topics/')) return topicOpen(pathname.slice(8));
  if (pathname.startsWith('/quiz/')) return { activeLeaf: `quiz:${pathname.slice(6)}`, open: ['quiz'] };
  if (pathname.startsWith('/notes/')) {
    const rest = pathname.slice(7);
    const sectionId = notes.find((n) => n.slug === rest)?.sectionId ?? rest;
    return { activeLeaf: `notes:${sectionId}`, open: ['notes'] };
  }
  return { open: [] };
}

const matches = (term: string, ...fields: string[]) => fields.some((f) => f.toLowerCase().includes(term));

/** A topic stays visible while filtering if its name or any of its questions match. */
function topicMatches(group: QuestionGroup, term: string) {
  return matches(term, group.label) || questionsIn(group).some((q) => matches(term, q.title, ...q.tags));
}

interface GroupProps {
  id: string;
  label: string;
  meta?: ReactNode;
  depth: number;
  open: boolean;
  onToggle: (id: string) => void;
  icon?: LucideIcon;
  children: ReactNode;
}

function AccordionGroup({ id, label, meta, depth, open, onToggle, icon: Icon, children }: GroupProps) {
  const panelId = `nav-${id.replace(/\W/g, '-')}`;
  return (
    <div className={`nav-group${depth === 0 ? ' is-root' : ''}`} style={{ '--depth': depth } as CSSProperties}>
      <button
        type="button"
        className="nav-group-header"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => onToggle(id)}
      >
        <ChevronRight className="nav-chevron" size={14} aria-hidden />
        {Icon && <Icon className="nav-icon" size={15} aria-hidden />}
        <span className="nav-label">{label}</span>
        {meta}
      </button>
      <div id={panelId} className={`nav-group-panel${open ? ' open' : ''}`} role="group" inert={!open}>
        <div className="nav-group-inner">{children}</div>
      </div>
    </div>
  );
}

function TopicLink({
  to,
  label,
  active,
  icon: Icon,
  meta,
}: {
  to: string;
  label: string;
  active: boolean;
  icon?: LucideIcon;
  meta?: ReactNode;
}) {
  return (
    <Link to={to} className={`nav-item${active ? ' active' : ''}`} aria-current={active ? 'page' : undefined} title={label}>
      {Icon ? <Icon className="nav-icon" size={15} aria-hidden /> : <span className="nav-bullet" aria-hidden />}
      <span className="nav-item-label">{label}</span>
      {meta}
    </Link>
  );
}

function Progress({ solved, total }: { solved: number; total: number }) {
  if (total && solved === total) {
    return (
      <span className="nav-count complete" title="All solved">
        <CheckCircle2 size={13} aria-label="all solved" />
      </span>
    );
  }
  return (
    <span className="nav-count" title={`${solved} of ${total} solved`}>
      {solved ? `${solved}/${total}` : total}
    </span>
  );
}

export default function Sidebar({
  collapsed,
  onToggleCollapsed,
  onExpand,
  mobileOpen,
  onCloseMobile,
  filter,
  onFilterChange,
  filterRef,
}: SidebarProps) {
  const { pathname } = useLocation();
  const { mode, setMode } = useTheme();
  const progress = useProgress();
  const [openIds, setOpenIds] = usePersistentState<string[]>('fp:sidebar:open', ['questions']);
  const location = locate(pathname);

  // Reveal wherever the current route lives in the tree.
  useEffect(() => {
    const needed = locate(pathname).open;
    setOpenIds((prev) => (needed.every((id) => prev.includes(id)) ? prev : [...new Set([...prev, ...needed])]));
  }, [pathname, setOpenIds]);

  const term = filter.trim().toLowerCase();
  const filtering = term.length > 0;
  const isOpen = (id: string) => filtering || openIds.includes(id);
  const toggle = (id: string) =>
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const solvedIn = (group: QuestionGroup) => questionsIn(group).filter((q) => progress[q.slug] === 'solved').length;
  const progressOf = (group: QuestionGroup) => <Progress solved={solvedIn(group)} total={questionsIn(group).length} />;

  const visibleTree = questionTree
    .map((g) => (g.children.length ? { ...g, children: g.children.filter((c) => !filtering || topicMatches(c, term)) } : g))
    .filter((g) => !filtering || (g.children.length ? g.children.length > 0 : topicMatches(g, term)));
  const decks = filtering ? quizDecks.filter((d) => matches(term, d.title)) : quizDecks;
  const sections = filtering
    ? noteSections.filter((s) => matches(term, s.label, ...s.notes.map((n) => n.title)))
    : noteSections;

  const topicLink = (group: QuestionGroup) => (
    <TopicLink
      key={group.id}
      to={`/topics/${group.id}`}
      label={group.label}
      active={location.activeLeaf === `topic:${group.id}`}
      icon={GROUP_ICONS[group.id]}
      meta={progressOf(group)}
    />
  );

  const openSectionFromRail = (id: string) => {
    setOpenIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    onExpand();
  };

  const nothingFound = filtering && !visibleTree.length && !decks.length && !sections.length;
  const railActive = location.open[0];

  return (
    <aside
      className={`sidebar${collapsed ? ' collapsed' : ''}${mobileOpen ? ' mobile-open' : ''}`}
      aria-label="Primary"
    >
      <div className="sidebar-header">
        <Link to="/" className="brand" title="Home">
          <span className="brand-mark" aria-hidden>
            {'</>'}
          </span>
          <span className="brand-name">Frontend Practice</span>
        </Link>
        <button
          type="button"
          className="icon-btn sidebar-collapse"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={`${collapsed ? 'Expand' : 'Collapse'} sidebar (⌘B)`}
        >
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
        <button type="button" className="icon-btn sidebar-close" onClick={onCloseMobile} aria-label="Close menu">
          <X size={16} />
        </button>
      </div>

      {/* Collapsed rail: one icon per section. */}
      <nav className="rail" aria-label="Sections">
        {SECTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`icon-btn rail-btn${railActive === id ? ' active' : ''}`}
            onClick={() => openSectionFromRail(id)}
            aria-label={label}
            title={label}
          >
            <Icon size={18} />
          </button>
        ))}
        <button
          type="button"
          className="icon-btn rail-btn"
          onClick={() => {
            onExpand();
            requestAnimationFrame(() => filterRef.current?.focus());
          }}
          aria-label="Search"
          title="Search (/)"
        >
          <Search size={18} />
        </button>
      </nav>

      <div className="sidebar-search">
        <Search size={14} className="search-icon" aria-hidden />
        <input
          ref={filterRef}
          type="search"
          placeholder="Find a topic or question…"
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              onFilterChange('');
              e.currentTarget.blur();
            }
          }}
          aria-label="Find a topic, question, deck or note"
        />
        {!filter && <Kbd>/</Kbd>}
      </div>

      <nav className="sidebar-tree" aria-label="Topics">
        {visibleTree.length > 0 && (
          <AccordionGroup
            id="questions"
            label="Questions"
            meta={<Progress solved={questionTree.reduce((n, g) => n + solvedIn(g), 0)} total={questionTree.reduce((n, g) => n + questionsIn(g).length, 0)} />}
            depth={0}
            open={isOpen('questions')}
            onToggle={toggle}
            icon={Code2}
          >
            {visibleTree.map((group) =>
              group.children.length ? (
                <AccordionGroup
                  key={group.id}
                  id={`questions/${group.id}`}
                  label={group.label}
                  meta={progressOf(group)}
                  depth={1}
                  open={isOpen(`questions/${group.id}`)}
                  onToggle={toggle}
                  icon={GROUP_ICONS[group.id]}
                >
                  {group.children.map(topicLink)}
                </AccordionGroup>
              ) : (
                <div key={group.id} className="nav-leaf-row" style={{ '--depth': 1 } as CSSProperties}>
                  {topicLink(group)}
                </div>
              ),
            )}
          </AccordionGroup>
        )}

        {decks.length > 0 && (
          <AccordionGroup
            id="quiz"
            label="Quiz"
            meta={<span className="nav-count">{decks.length}</span>}
            depth={0}
            open={isOpen('quiz')}
            onToggle={toggle}
            icon={ListChecks}
          >
            {decks.map((deck) => (
              <TopicLink
                key={deck.slug}
                to={`/quiz/${deck.slug}`}
                label={deck.title}
                active={location.activeLeaf === `quiz:${deck.slug}`}
                meta={<span className="nav-count">{deck.cards.length}</span>}
              />
            ))}
          </AccordionGroup>
        )}

        {sections.length > 0 && (
          <AccordionGroup
            id="notes"
            label="Notes"
            meta={<span className="nav-count">{sections.length}</span>}
            depth={0}
            open={isOpen('notes')}
            onToggle={toggle}
            icon={StickyNote}
          >
            {sections.map((s) => (
              <TopicLink
                key={s.id}
                to={`/notes/${s.id}`}
                label={s.label}
                active={location.activeLeaf === `notes:${s.id}`}
                meta={<span className="nav-count">{s.notes.length}</span>}
              />
            ))}
          </AccordionGroup>
        )}

        {nothingFound && <p className="nav-empty">Nothing matches “{filter}”.</p>}
      </nav>

      <div className="sidebar-footer">
        <div className="segmented theme-switch" role="radiogroup" aria-label="Theme">
          {THEME_OPTIONS.map(({ mode: m, label, icon: Icon }) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={mode === m}
              className={mode === m ? 'active' : ''}
              onClick={() => setMode(m)}
              title={label}
            >
              <Icon size={14} aria-hidden />
              <span>{label}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className="icon-btn rail-btn rail-theme"
          onClick={() => {
            const i = THEME_OPTIONS.findIndex((o) => o.mode === mode);
            setMode(THEME_OPTIONS[(i + 1) % THEME_OPTIONS.length].mode);
          }}
          aria-label={`Theme: ${mode}`}
          title={`Theme: ${mode}`}
        >
          {mode === 'light' ? <Sun size={18} /> : mode === 'dark' ? <Moon size={18} /> : <Monitor size={18} />}
        </button>
      </div>
    </aside>
  );
}
