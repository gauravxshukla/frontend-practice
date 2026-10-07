import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { createBrowserRouter, Link, Outlet, RouterProvider, useLocation } from 'react-router';
import { Menu } from 'lucide-react';
import CatalogPage from '../features/catalog/CatalogPage';
import QuizIndex from '../features/quiz/QuizIndex';
import QuizDeckPage from '../features/quiz/QuizDeckPage';
import NotesPage from '../features/notes/NotesPage';
import TopicPage from '../features/topic/TopicPage';
import { usePersistentState } from '../lib/usePersistentState';
import Sidebar from './Sidebar';
import './layout.css';

// Sandpack is heavy; only load it when a question is opened.
const QuestionPage = lazy(() => import('../features/workspace/QuestionPage'));

const isMobile = () => window.matchMedia('(max-width: 860px)').matches;

function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return !!el && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName));
}

function Layout() {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = usePersistentState('fp:sidebar:collapsed', false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const filterRef = useRef<HTMLInputElement>(null);

  // Close the drawer whenever the route changes.
  useEffect(() => setMobileOpen(false), [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        if (isMobile()) setMobileOpen((open) => !open);
        else setCollapsed((c) => !c);
      } else if (e.key === '/' && !isTyping(e.target)) {
        e.preventDefault();
        if (isMobile()) setMobileOpen(true);
        else setCollapsed(false);
        requestAnimationFrame(() => filterRef.current?.focus());
      } else if (e.key === 'Escape') {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setCollapsed]);

  return (
    <div className="app-shell">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((c) => !c)}
        onExpand={() => setCollapsed(false)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        filter={filter}
        onFilterChange={setFilter}
        filterRef={filterRef}
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
        </header>
        <Suspense fallback={<div className="page-loading" aria-busy="true" />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
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
]);

export default function App() {
  return <RouterProvider router={router} />;
}
