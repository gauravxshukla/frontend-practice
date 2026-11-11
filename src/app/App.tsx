import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { createBrowserRouter, Link, Outlet, RouterProvider, useLocation } from 'react-router';
import { Binary, Braces, House, LayoutGrid, ListChecks, Menu, Monitor, Moon, PanelLeft, Search, StickyNote, Sun } from 'lucide-react';
import CatalogPage from '../features/catalog/CatalogPage';
import QuizIndex from '../features/quiz/QuizIndex';
import QuizDeckPage from '../features/quiz/QuizDeckPage';
import NotesPage from '../features/notes/NotesPage';
import TopicPage from '../features/topic/TopicPage';
import CommandPalette from '../features/palette/CommandPalette';
import { buildIndex, type PaletteAction, type PaletteItem } from '../features/palette/paletteIndex';
import { ConfirmProvider } from '../components/overlay/ConfirmProvider';
import { ToastProvider } from '../components/overlay/ToastProvider';
import TooltipLayer from '../components/overlay/TooltipLayer';
import { isTyping, modKey } from '../lib/platform';
import { recordVisit } from '../lib/recent';
import { setThemeMode } from '../lib/theme';
import { usePersistentState } from '../lib/usePersistentState';
import Sidebar from './Sidebar';
import './layout.css';

// Sandpack is heavy; only load it when a question is opened.
const QuestionPage = lazy(() => import('../features/workspace/QuestionPage'));

const isMobile = () => window.matchMedia('(max-width: 860px)').matches;

/** Before you type: the three tracks, then Quiz and Notes. */
function jumpToItems(actions: PaletteAction[]): PaletteItem[] {
  const tracks = buildIndex().filter((i) => ['t:js', 't:dsa', 't:machine-coding'].includes(i.id));
  const icons: Record<string, typeof Braces> = { 't:js': Braces, 't:dsa': Binary, 't:machine-coding': LayoutGrid };
  return [
    ...tracks.map((t): PaletteAction => ({ ...t, kind: 'action', icon: icons[t.id] })),
    ...actions.filter((a) => a.id === 'a:go-quiz' || a.id === 'a:go-notes'),
  ];
}

function Layout() {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = usePersistentState('fp:sidebar:collapsed', false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Close the drawer whenever the route changes.
  useEffect(() => setMobileOpen(false), [pathname]);
  useEffect(() => recordVisit(pathname), [pathname]);

  const toggleSidebar = useCallback(() => {
    if (isMobile()) setMobileOpen((open) => !open);
    else setCollapsed((c) => !c);
  }, [setCollapsed]);

  const openPalette = useCallback(() => {
    setMobileOpen(false);
    setPaletteOpen(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      // Another dialog (a confirm) owns the keyboard while it's open.
      const otherDialog = document.querySelector('dialog[open]:not(.palette)');
      if (mod && e.key.toLowerCase() === 'k') {
        // Capture phase, so this works inside the code editor too.
        e.preventDefault();
        e.stopPropagation();
        if (otherDialog) return;
        setMobileOpen(false);
        setPaletteOpen((open) => !open);
      } else if (mod && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      } else if (e.key === '/' && !mod && !e.altKey && !isTyping(e.target) && !document.querySelector('dialog[open]')) {
        e.preventDefault();
        openPalette();
      } else if (e.key === 'Escape') {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [toggleSidebar, openPalette]);

  const actions = useMemo(
    (): PaletteAction[] => [
      { id: 'a:go-home', kind: 'action', title: 'Go to Home', keywords: ['dashboard', 'practice'], href: '/', icon: House },
      { id: 'a:go-quiz', kind: 'action', title: 'Quiz', subtitle: 'Flashcard decks', keywords: ['flashcards'], href: '/quiz', icon: ListChecks },
      { id: 'a:go-notes', kind: 'action', title: 'Notes', subtitle: 'Reference material', keywords: ['reading'], href: '/notes', icon: StickyNote },
      {
        id: 'a:toggle-sidebar',
        kind: 'action',
        title: collapsed ? 'Expand sidebar' : 'Collapse sidebar',
        keywords: ['sidebar', 'toggle', 'collapse', 'expand'],
        kbd: `${modKey} B`,
        icon: PanelLeft,
        run: toggleSidebar,
      },
      { id: 'a:theme-light', kind: 'action', title: 'Theme: Light', keywords: ['appearance', 'mode'], icon: Sun, run: () => setThemeMode('light') },
      { id: 'a:theme-dark', kind: 'action', title: 'Theme: Dark', keywords: ['appearance', 'mode'], icon: Moon, run: () => setThemeMode('dark') },
      { id: 'a:theme-system', kind: 'action', title: 'Theme: System', keywords: ['appearance', 'mode', 'auto'], icon: Monitor, run: () => setThemeMode('system') },
    ],
    [collapsed, toggleSidebar],
  );
  const jumpTo = useMemo(() => jumpToItems(actions), [actions]);

  return (
    <ToastProvider>
      <ConfirmProvider>
        <div className="app-shell">
          <Sidebar
            collapsed={collapsed}
            onToggleCollapsed={() => setCollapsed((c) => !c)}
            mobileOpen={mobileOpen}
            onCloseMobile={() => setMobileOpen(false)}
            onOpenSearch={openPalette}
          />
          {mobileOpen && <div className="sidebar-backdrop" onClick={() => setMobileOpen(false)} aria-hidden />}

          <div className="main">
            <header className="mobile-topbar">
              <button type="button" className="icon-btn" onClick={() => setMobileOpen(true)} aria-label="Open menu">
                <Menu size={18} />
              </button>
              <Link to="/" className="brand">
                <span className="brand-mark" aria-hidden>
                  {'</>'}
                </span>
                Frontend Practice
              </Link>
              <button type="button" className="icon-btn" onClick={openPalette} aria-label="Search">
                <Search size={18} />
              </button>
            </header>
            <Suspense fallback={<div className="page-loading" aria-busy="true" />}>
              <Outlet />
            </Suspense>
          </div>
        </div>
        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} actions={actions} jumpTo={jumpTo} />
        <TooltipLayer />
      </ConfirmProvider>
    </ToastProvider>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <CatalogPage /> },
      { path: 'topics/*', element: <TopicPage /> },
      { path: 'q/*', element: <QuestionPage /> },
      { path: 'quiz', element: <QuizIndex /> },
      { path: 'quiz/:deck', element: <QuizDeckPage /> },
      { path: 'notes/*', element: <NotesPage /> },
    ],
  },
], { basename: import.meta.env.BASE_URL });

export default function App() {
  return <RouterProvider router={router} />;
}
