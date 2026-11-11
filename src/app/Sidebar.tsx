import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router';
import {
  Atom,
  Binary,
  Braces,
  CheckCircle2,
  ChevronRight,
  Code2,
  FileCode,
  House,
  Keyboard,
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
import { questionsIn, questionTree, type QuestionGroup } from '../lib/content/catalog';
import { noteSections, notes } from '../lib/content/notes';
import { quizDecks } from '../lib/content/quiz';
import { useProgress } from '../lib/progress';
import { groupUrl, notesUrl, parseRoute, quizUrl } from '../lib/routes';
import { ariaKeysFor, keysFor } from '../lib/shortcuts';
import { useTheme, type ThemeMode } from '../lib/theme';
import { useHoverIntent } from '../lib/useHoverIntent';
import { usePersistentState } from '../lib/usePersistentState';
import { Kbd } from '../components/Kbd';
import SidebarPeek, { type SectionId } from './SidebarPeek';
import './sidebar.css';

const GROUP_ICONS: Record<string, LucideIcon> = {
  js: Braces,
  dsa: Binary,
  'machine-coding': LayoutGrid,
  'machine-coding/react': Atom,
  'machine-coding/vanilla': FileCode,
};

const SECTIONS: { id: SectionId; label: string; icon: LucideIcon }[] = [
  { id: 'questions', label: 'Questions', icon: Code2 },
  { id: 'quiz', label: 'Quiz', icon: ListChecks },
  { id: 'notes', label: 'Notes', icon: StickyNote },
];

const THEME_OPTIONS: { mode: ThemeMode; label: string; icon: LucideIcon }[] = [
  { mode: 'system', label: 'System', icon: Monitor },
  { mode: 'light', label: 'Light', icon: Sun },
  { mode: 'dark', label: 'Dark', icon: Moon },
];

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  /** Opens the command palette. */
  onOpenSearch: () => void;
  onOpenShortcuts: () => void;
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
  const route = parseRoute(pathname);
  switch (route.kind) {
    case 'question':
      return topicOpen(route.question.groupId);
    case 'group':
      return topicOpen(route.group.id);
    case 'quiz':
      return route.deck ? { activeLeaf: `quiz:${route.deck}`, open: ['quiz'] } : { open: [] };
    case 'notes': {
      if (!route.slug) return { open: [] };
      const sectionId = notes.find((n) => n.slug === route.slug)?.sectionId ?? route.slug;
      return { activeLeaf: `notes:${sectionId}`, open: ['notes'] };
    }
    default:
      return { open: [] };
  }
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
    <Link
      to={to}
      className={`nav-item${active ? ' active' : ''}`}
      aria-current={active ? 'page' : undefined}
      // Only long names get cut off; a tooltip on every row would be noise.
      data-tooltip={label.length > 26 ? label : undefined}
      data-tooltip-side="right"
    >
      {Icon ? <Icon className="nav-icon" size={15} aria-hidden /> : <span className="nav-bullet" aria-hidden />}
      <span className="nav-item-label">{label}</span>
      {meta}
    </Link>
  );
}

function Progress({ solved, total }: { solved: number; total: number }) {
  if (total && solved === total) {
    return (
      <span className="nav-count complete" data-tooltip="All solved">
        <CheckCircle2 size={13} aria-label="all solved" />
      </span>
    );
  }
  return (
    <span className="nav-count" data-tooltip={`${solved} of ${total} solved`}>
      {solved ? `${solved}/${total}` : total}
    </span>
  );
}

export default function Sidebar({
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onCloseMobile,
  onOpenSearch,
  onOpenShortcuts,
}: SidebarProps) {
  const { pathname } = useLocation();
  const { mode, setMode } = useTheme();
  const progress = useProgress();
  const [openIds, setOpenIds] = usePersistentState<string[]>('fp:sidebar:open', ['questions']);
  const location = locate(pathname);

  // Collapsed rail: hovering a section peeks at it; clicking (or the keyboard) pins it open.
  const hover = useHoverIntent<SectionId>();
  const [pinned, setPinned] = useState(false);
  const [focusFirst, setFocusFirst] = useState(false);
  const railButtons = useRef(new Map<SectionId, HTMLButtonElement>());
  const peek = collapsed ? hover.current : null;

  const closePeek = (focusAnchor = false) => {
    const anchor = peek ? railButtons.current.get(peek) : undefined;
    hover.set(null);
    setPinned(false);
    setFocusFirst(false);
    if (focusAnchor) anchor?.focus();
  };

  const openPeek = (id: SectionId, fromKeyboard: boolean) => {
    hover.set(id);
    setPinned(true);
    setFocusFirst(fromKeyboard);
  };

  // Reveal wherever the current route lives in the tree.
  useEffect(() => {
    const needed = locate(pathname).open;
    setOpenIds((prev) => (needed.every((id) => prev.includes(id)) ? prev : [...new Set([...prev, ...needed])]));
  }, [pathname, setOpenIds]);

  // Navigating, or expanding the sidebar, puts the peek away.
  const { set: setPeek } = hover;
  useEffect(() => {
    setPeek(null);
    setPinned(false);
  }, [pathname, collapsed, setPeek]);

  // A pinned peek closes on a click anywhere else.
  useEffect(() => {
    if (!pinned) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Element;
      if (!target.closest('.sidebar-peek, .rail-section')) {
        setPeek(null);
        setPinned(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [pinned, setPeek]);

  const isOpen = (id: string) => openIds.includes(id);
  const toggle = (id: string) =>
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const solvedIn = (group: QuestionGroup) => questionsIn(group).filter((q) => progress[q.slug] === 'solved').length;
  const progressOf = (group: QuestionGroup) => <Progress solved={solvedIn(group)} total={questionsIn(group).length} />;

  const topicLink = (group: QuestionGroup) => (
    <TopicLink
      key={group.id}
      to={groupUrl(group.id)}
      label={group.label}
      active={location.activeLeaf === `topic:${group.id}`}
      icon={GROUP_ICONS[group.id]}
      meta={progressOf(group)}
    />
  );

  const onRailClick = (id: SectionId) => (e: MouseEvent<HTMLButtonElement>) => {
    // detail 0: Enter/Space. Open and move into the menu.
    // A mouse click pins a hover-opened peek, or closes a pinned one.
    const fromKeyboard = e.detail === 0;
    if (!fromKeyboard && peek === id && pinned) closePeek();
    else openPeek(id, fromKeyboard);
  };

  const railActive = location.open[0];
  const toggleLabel = collapsed ? 'Expand sidebar' : 'Collapse sidebar';
  const themeLabel = THEME_OPTIONS.find((o) => o.mode === mode)?.label ?? 'System';

  return (
    <aside
      className={`sidebar${collapsed ? ' collapsed' : ''}${mobileOpen ? ' mobile-open' : ''}`}
      aria-label="Primary"
    >
      <div className="sidebar-header">
        <Link to="/" className="brand" aria-label="Frontend Practice, home">
          <span className="brand-mark" aria-hidden>
            {'</>'}
          </span>
          <span className="brand-name">Frontend Practice</span>
        </Link>
        {/* Collapsed: the logo turns into the expand button on hover. */}
        <button
          type="button"
          className="sidebar-expand"
          onClick={onToggleCollapsed}
          aria-label="Expand sidebar"
          data-tooltip="Expand sidebar"
          data-tooltip-kbd={keysFor('sidebar')}
          aria-keyshortcuts={ariaKeysFor('sidebar')}
          data-tooltip-side="right"
        >
          <span className="brand-mark" aria-hidden>
            {'</>'}
          </span>
          <PanelLeftOpen size={18} className="sidebar-expand-icon" aria-hidden />
        </button>
        <button
          type="button"
          className="icon-btn sidebar-collapse"
          onClick={onToggleCollapsed}
          aria-label="Collapse sidebar"
          data-tooltip="Collapse sidebar"
          data-tooltip-kbd={keysFor('sidebar')}
          aria-keyshortcuts={ariaKeysFor('sidebar')}
        >
          <PanelLeftClose size={16} />
        </button>
        <button type="button" className="icon-btn sidebar-close" onClick={onCloseMobile} aria-label="Close menu">
          <X size={16} />
        </button>
      </div>

      {/* Collapsed rail: Home, one icon per section (peek menus), Search. */}
      <nav className="rail" aria-label="Sections">
        <Link
          to="/"
          className={`icon-btn rail-btn${pathname === '/' ? ' active' : ''}`}
          aria-label="Home"
          aria-current={pathname === '/' ? 'page' : undefined}
          data-tooltip="Home"
          data-tooltip-side="right"
        >
          <House size={18} />
        </Link>
        {SECTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            ref={(el) => {
              if (el) railButtons.current.set(id, el);
              else railButtons.current.delete(id);
            }}
            type="button"
            className={`icon-btn rail-btn rail-section${railActive === id ? ' active' : ''}${peek === id ? ' peeking' : ''}`}
            aria-label={label}
            aria-expanded={peek === id}
            aria-controls={peek === id ? `peek-${id}` : undefined}
            data-tooltip={label}
            data-tooltip-kbd={keysFor('rail-open')}
            data-tooltip-side="right"
            data-tooltip-focus-only=""
            onPointerEnter={(e) => e.pointerType === 'mouse' && hover.enter(id)}
            onPointerLeave={(e) => e.pointerType === 'mouse' && !pinned && hover.leave()}
            onClick={onRailClick(id)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') {
                e.preventDefault();
                openPeek(id, true);
              } else if (e.key === 'Escape' && peek === id) {
                closePeek();
              }
            }}
          >
            <Icon size={18} />
          </button>
        ))}
        <button
          type="button"
          className="icon-btn rail-btn"
          onClick={onOpenSearch}
          aria-label="Search"
          aria-keyshortcuts={ariaKeysFor('search')}
          data-tooltip="Search"
          data-tooltip-kbd={keysFor('search')}
          data-tooltip-side="right"
        >
          <Search size={18} />
        </button>
      </nav>

      {peek && railButtons.current.get(peek) && (
        <SidebarPeek
          id={`peek-${peek}`}
          section={peek}
          label={SECTIONS.find((sec) => sec.id === peek)!.label}
          anchor={railButtons.current.get(peek)!}
          activeLeaf={location.activeLeaf}
          focusFirst={focusFirst}
          onClose={closePeek}
          onPointerEnter={hover.cancelClose}
          onPointerLeave={() => !pinned && hover.leave()}
          groupIcons={GROUP_ICONS}
        />
      )}

      {/* Expanded: looks like a search box, opens the command palette. */}
      <div className="sidebar-search">
        <button type="button" className="sidebar-search-trigger" onClick={onOpenSearch} aria-keyshortcuts={ariaKeysFor('search')}>
          <Search size={14} className="search-icon" aria-hidden />
          <span>Search…</span>
          <Kbd>/</Kbd>
        </button>
      </div>

      <nav className="sidebar-tree" aria-label="Topics">
        <AccordionGroup
          id="questions"
          label="Questions"
          meta={<Progress solved={questionTree.reduce((n, g) => n + solvedIn(g), 0)} total={questionTree.reduce((n, g) => n + questionsIn(g).length, 0)} />}
          depth={0}
          open={isOpen('questions')}
          onToggle={toggle}
          icon={Code2}
        >
          {questionTree.map((group) =>
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

        <AccordionGroup
          id="quiz"
          label="Quiz"
          meta={<span className="nav-count">{quizDecks.length}</span>}
          depth={0}
          open={isOpen('quiz')}
          onToggle={toggle}
          icon={ListChecks}
        >
          {quizDecks.map((deck) => (
            <TopicLink
              key={deck.slug}
              to={quizUrl(deck.slug)}
              label={deck.title}
              active={location.activeLeaf === `quiz:${deck.slug}`}
              meta={<span className="nav-count">{deck.cards.length}</span>}
            />
          ))}
        </AccordionGroup>

        <AccordionGroup
          id="notes"
          label="Notes"
          meta={<span className="nav-count">{noteSections.length}</span>}
          depth={0}
          open={isOpen('notes')}
          onToggle={toggle}
          icon={StickyNote}
        >
          {noteSections.map((s) => (
            <TopicLink
              key={s.id}
              to={notesUrl(s.id)}
              label={s.label}
              active={location.activeLeaf === `notes:${s.id}`}
              meta={<span className="nav-count">{s.notes.length}</span>}
            />
          ))}
        </AccordionGroup>
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
          aria-label={`Theme: ${themeLabel}. Switch theme`}
          data-tooltip={`Theme: ${themeLabel} · click to switch`}
          data-tooltip-side="right"
        >
          {mode === 'light' ? <Sun size={18} /> : mode === 'dark' ? <Moon size={18} /> : <Monitor size={18} />}
        </button>
        <button
          type="button"
          className="icon-btn sidebar-keys"
          onClick={onOpenShortcuts}
          aria-label="Keyboard shortcuts"
          aria-keyshortcuts={ariaKeysFor('shortcuts')}
          data-tooltip="Keyboard shortcuts"
          data-tooltip-kbd={keysFor('shortcuts')}
          data-tooltip-side={collapsed ? 'right' : 'top'}
        >
          <Keyboard size={collapsed ? 18 : 16} />
        </button>
      </div>

      {/* The sidebar's right border: hover shows a handle, click toggles. Keyboard users have ⌘B and the header buttons. */}
      <button
        type="button"
        className="sidebar-edge"
        tabIndex={-1}
        onClick={onToggleCollapsed}
        aria-label={toggleLabel}
        data-tooltip={toggleLabel}
        data-tooltip-kbd={keysFor('sidebar')}
        data-tooltip-side="right"
      >
        <span className="sidebar-edge-pill" aria-hidden />
      </button>
    </aside>
  );
}
