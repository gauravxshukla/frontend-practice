import type { FileMap } from './content/catalog';

// Drafts are a per-browser convenience: every access is guarded because
// storage can be unavailable (private mode, blocked site data).
//
// v2 drafts (`{ v: 2, files }`) hold the complete set of the user's files, so a
// file they deleted or renamed in the explorer stays gone. v1 drafts (a plain
// FileMap of edited files) predate the explorer and are merged over the starter.
const key = (slug: string) => `fp:draft:${slug}`;

/** Draft id for a question: React Native attempts are kept apart from web ones. */
export const draftKey = (slug: string, platform: 'web' | 'native' = 'web') =>
  platform === 'native' ? `${slug}#native` : slug;

export interface Draft {
  files: FileMap;
  /** true = `files` is the whole file set (v2); false = edits to merge over the starter (v1). */
  complete: boolean;
}

const isFileMap = (v: unknown): v is FileMap =>
  typeof v === 'object' && v !== null && !Array.isArray(v) && Object.values(v).every((c) => typeof c === 'string');

/** Parses a stored draft; anything unreadable counts as no draft. */
export function parseDraft(raw: string | null): Draft | null {
  if (raw === null) return null;
  try {
    const data: unknown = JSON.parse(raw);
    if (typeof data === 'object' && data !== null && (data as { v?: unknown }).v === 2) {
      const files = (data as { files?: unknown }).files;
      return isFileMap(files) ? { files, complete: true } : null;
    }
    return isFileMap(data) ? { files: data, complete: false } : null;
  } catch {
    return null;
  }
}

/** The files to open: the draft's own set (v2), or the starter with v1 edits on top. */
export function applyDraft(starter: FileMap, draft: Draft | null): FileMap {
  if (!draft) return starter;
  return draft.complete ? draft.files : { ...starter, ...draft.files };
}

export function loadDraft(slug: string): Draft | null {
  try {
    return parseDraft(localStorage.getItem(key(slug)));
  } catch {
    return null;
  }
}

/** Saves `files` as the complete file set for `slug`. */
export function saveDraft(slug: string, files: FileMap) {
  try {
    localStorage.setItem(key(slug), JSON.stringify({ v: 2, files }));
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
