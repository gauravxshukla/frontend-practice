import { joinPath } from './buildTree';

const MAX_NAME = 100;

interface ValidateOptions {
  /** Every file path currently in the sandbox. */
  existing: string[];
  /** Empty folders the user created that have no files yet. */
  pendingFolders?: string[];
  /** When renaming: the item's current path, which may keep its own name. */
  self?: string;
}

/**
 * Checks a name typed into the explorer for a new or renamed item inside `parent`.
 * Returns an error message for the user, or null when the name is fine.
 */
export function validateNewPath(name: string, parent: string, { existing, pendingFolders = [], self }: ValidateOptions) {
  const trimmed = name.trim();
  if (!trimmed) return 'Enter a name.';
  if (/[/\\]/.test(trimmed)) return 'Names can’t contain slashes.';
  if (trimmed === '.' || trimmed === '..') return 'That name is reserved.';
  if (trimmed.length > MAX_NAME) return `Keep names under ${MAX_NAME} characters.`;

  const target = joinPath(parent, trimmed);
  if (target === self) return null;
  const taken =
    existing.includes(target) ||
    existing.some((p) => p.startsWith(`${target}/`)) ||
    pendingFolders.includes(target);
  return taken ? `“${trimmed}” already exists here.` : null;
}
