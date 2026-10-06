import type { FileMap } from './content/catalog';

// Drafts are a per-browser convenience: every access is guarded because
// storage can be unavailable (private mode, blocked site data).
const key = (slug: string) => `fp:draft:${slug}`;

export function loadDraft(slug: string): FileMap | null {
  try {
    const raw = localStorage.getItem(key(slug));
    return raw ? (JSON.parse(raw) as FileMap) : null;
  } catch {
    return null;
  }
}

export function saveDraft(slug: string, files: FileMap) {
  try {
    localStorage.setItem(key(slug), JSON.stringify(files));
  } catch {
    // Ignore: the attempt just won't survive a reload.
  }
}

export function clearDraft(slug: string) {
  try {
    localStorage.removeItem(key(slug));
  } catch {
    // Ignore.
  }
}
