import './App.css';
import { createBrowserRouter, RouterProvider, Link, Outlet } from 'react-router';
import { useState } from 'react';
import AsyncUIIndex from './ui-coding/asyncUI';
import DesignComponentsIndex from './ui-coding/designComponents';
import FormsIndex from './ui-coding/forms';
import HooksIndex from './ui-coding/hooks';
import StateManagementIndex from './ui-coding/stateManagement';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <h1>React Practice</h1>
        <nav className="nav">
          <Link to="/" onClick={() => setSidebarOpen(false)}>Home</Link>
          <Link to="/async-ui" onClick={() => setSidebarOpen(false)}>Async UI</Link>
          <Link to="/design-components" onClick={() => setSidebarOpen(false)}>Design Components</Link>
          <Link to="/forms" onClick={() => setSidebarOpen(false)}>Forms</Link>
          <Link to="/hooks" onClick={() => setSidebarOpen(false)}>Hooks</Link>
          <Link to="/state-management" onClick={() => setSidebarOpen(false)}>State Management</Link>
        </nav>
      </aside>
      <main className="main">
        <div className="topbar">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle navigation">☰</button>
        </div>
        <Outlet />
      </main>
    </div>
  );
}

function Home() {
  return (
    <>
    <h1>Let's learn React UI Coding</h1>
    <p>Select a section from the navigation above.</p>
    </>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'async-ui', element: <AsyncUIIndex /> },
      { path: 'design-components', element: <DesignComponentsIndex /> },
      { path: 'forms', element: <FormsIndex /> },
      { path: 'hooks', element: <HooksIndex /> },
      { path: 'state-management', element: <StateManagementIndex /> },
    ],
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
};

export default App;
