import { useEffect, useMemo, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import {
  Atom,
  Binary,
  Braces,
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
import {
  countQuestions,
  questionTree,
  type Question,
  type QuestionGroup,
} from '../lib/content/catalog';
import { notes, type Note } from '../lib/content/notes';
import { quizDecks } from '../lib/content/quiz';
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

/** Group ids that must be open for the current route to be visible. */
function openIdsForPath(pathname: string): string[] {
  if (pathname.startsWith('/q/')) {
    const slug = pathname.slice(3);
    if (slug.startsWith('machine-coding/')) {
      const type = slug.split('/')[1];
      return ['questions', 'questions/machine-coding', `questions/machine-coding/${type}`];
    }
    return ['questions', `questions/${slug.split('/')[0]}`];
  }
  if (pathname.startsWith('/quiz')) return ['quiz'];
  if (pathname.startsWith('/notes/')) {
    const note = notes.find((n) => pathname === `/notes/${n.slug}`);
    return note ? ['notes', `notes/${note.section}`] : ['notes'];
  }
  return [];
}

function matches(term: string, ...fields: string[]) {
  return fields.some((f) => f.toLowerCase().includes(term));
}

function filterGroup(group: QuestionGroup, term: string): QuestionGroup | null {
  const questions = group.questions.filter((q) => matches(term, q.title, ...q.tags));
  const children = group.children.map((c) => filterGroup(c, term)).filter(Boolean) as QuestionGroup[];
  return questions.length || children.length ? { ...group, questions, children } : null;
}

interface GroupProps {
  id: string;
  label: string;
  count: number;
  depth: number;
  open: boolean;
  onToggle: (id: string) => void;
  icon?: LucideIcon;
  children: ReactNode;
}

function AccordionGroup({ id, label, count, depth, open, onToggle, icon: Icon, children }: GroupProps) {
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
        <span className="nav-count">{count}</span>
      </button>
      <div id={panelId} className={`nav-group-panel${open ? ' open' : ''}`} role="group" inert={!open}>
        <div className="nav-group-inner">{children}</div>
      </div>
    </div>
  );
}

function NavItem({ to, children, title }: { to: string; children: ReactNode; title?: string }) {
  return (
    <NavLink to={to} className="nav-item" title={title} end>
      {children}
    </NavLink>
  );
}

function QuestionItem({ q }: { q: Question }) {
  return (
    <NavItem to={`/q/${q.slug}`} title={q.title}>
      <span
        className={`difficulty-dot dot-${q.difficulty}${q.hasSolution ? '' : ' hollow'}`}
        aria-label={`${q.difficulty}${q.hasSolution ? '' : ', no solution yet'}`}
      />
      <span className="nav-item-label">{q.title}</span>
    </NavItem>
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
  const [openIds, setOpenIds] = usePersistentState<string[]>('fp:sidebar:open', ['questions']);

  // Reveal wherever the current route lives in the tree.
  useEffect(() => {
    const needed = openIdsForPath(pathname);
    setOpenIds((prev) => (needed.every((id) => prev.includes(id)) ? prev : [...new Set([...prev, ...needed])]));
  }, [pathname, setOpenIds]);

  const term = filter.trim().toLowerCase();
  const filtering = term.length > 0;
  const isOpen = (id: string) => filtering || openIds.includes(id);
  const toggle = (id: string) =>
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const tree = useMemo(
    () => (filtering ? (questionTree.map((g) => filterGroup(g, term)).filter(Boolean) as QuestionGroup[]) : questionTree),
    [filtering, term],
  );
  const decks = filtering ? quizDecks.filter((d) => matches(term, d.title)) : quizDecks;
  const visibleNotes = filtering ? notes.filter((n) => matches(term, n.title, n.section)) : notes;
  const noteSections = [...new Set(visibleNotes.map((n) => n.section))];
  const totalQuestions = tree.reduce((n, g) => n + countQuestions(g), 0);

  const renderGroup = (group: QuestionGroup, depth: number): ReactNode => (
    <AccordionGroup
      key={group.id}
      id={`questions/${group.id}`}
      label={group.label}
      count={countQuestions(group)}
      depth={depth}
      open={isOpen(`questions/${group.id}`)}
      onToggle={toggle}
      icon={GROUP_ICONS[group.id]}
    >
      {group.children.map((child) => renderGroup(child, depth + 1))}
      {group.questions.map((q) => (
        <QuestionItem key={q.slug} q={q} />
      ))}
    </AccordionGroup>
  );

  const openSectionFromRail = (id: string) => {
    setOpenIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    onExpand();
  };

  const nothingFound = filtering && !tree.length && !decks.length && !visibleNotes.length;

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
            className={`icon-btn rail-btn${openIdsForPath(pathname)[0] === id ? ' active' : ''}`}
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
          placeholder="Filter…"
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              onFilterChange('');
              e.currentTarget.blur();
            }
          }}
          aria-label="Filter questions, decks and notes"
        />
        {!filter && <Kbd>/</Kbd>}
      </div>

      <nav className="sidebar-tree" aria-label="Content">
        {(!filtering || tree.length > 0) && (
          <AccordionGroup
            id="questions"
            label="Questions"
            count={totalQuestions}
            depth={0}
            open={isOpen('questions')}
            onToggle={toggle}
            icon={Code2}
          >
            {tree.map((group) => renderGroup(group, 1))}
          </AccordionGroup>
        )}

        {(!filtering || decks.length > 0) && (
          <AccordionGroup id="quiz" label="Quiz" count={decks.length} depth={0} open={isOpen('quiz')} onToggle={toggle} icon={ListChecks}>
            {decks.map((deck) => (
              <NavItem key={deck.slug} to={`/quiz/${deck.slug}`} title={deck.title}>
                <span className="nav-bullet" aria-hidden />
                <span className="nav-item-label">{deck.title}</span>
                <span className="nav-count">{deck.cards.length}</span>
              </NavItem>
            ))}
          </AccordionGroup>
        )}

        {(!filtering || visibleNotes.length > 0) && (
          <AccordionGroup id="notes" label="Notes" count={visibleNotes.length} depth={0} open={isOpen('notes')} onToggle={toggle} icon={StickyNote}>
            {noteSections.map((section) => {
              const items = visibleNotes.filter((n: Note) => n.section === section);
              return (
                <AccordionGroup
                  key={section}
                  id={`notes/${section}`}
                  label={section}
                  count={items.length}
                  depth={1}
                  open={isOpen(`notes/${section}`)}
                  onToggle={toggle}
                >
                  {items.map((n) => (
                    <NavItem key={n.slug} to={`/notes/${n.slug}`} title={n.title}>
                      <span className="nav-bullet" aria-hidden />
                      <span className="nav-item-label">{n.title}</span>
                    </NavItem>
                  ))}
                </AccordionGroup>
              );
            })}
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

