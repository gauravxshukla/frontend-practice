import { legacyRedirect } from './routes';

// Recently visited pages (pathnames), newest first, for the command palette's
// suggestions. Storage can be unavailable, so every access is guarded.
const KEY = 'fp:recent';
const MAX = 8;

export function readRecent(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    if (!Array.isArray(parsed)) return [];
    // Visits saved before the URL change (/q/…, /topics/…) map to today's URLs.
    const paths = parsed.filter((p): p is string => typeof p === 'string').map((p) => legacyRedirect(p) ?? p);
    return [...new Set(paths)].slice(0, MAX);
  } catch {
    return [];
  }
}

export function recordVisit(pathname: string) {
  if (pathname === '/' || !pathname) return;
  const next = [pathname, ...readRecent().filter((p) => p !== pathname)].slice(0, MAX);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Recents just won't persist.
  }
}
