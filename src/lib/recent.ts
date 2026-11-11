// Recently visited pages (pathnames), newest first, for the command palette's
// suggestions. Storage can be unavailable, so every access is guarded.
const KEY = 'fp:recent';
const MAX = 8;

export function readRecent(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((p): p is string => typeof p === 'string').slice(0, MAX) : [];
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
