import { isMac } from './platform';

// Every keyboard shortcut in the app, in one place: the shortcuts sheet lists
// these, and tooltips / aria-keyshortcuts take their key hints from here, so what
// we show can't drift from what we document. The handlers live with the features.

/** A key combination: modifiers (`mod` = ⌘ on Mac, Ctrl elsewhere; `alt`; `shift`) then the key. */
type Combo = string[];

export type ShortcutContext = 'browse' | 'code' | 'machine-coding';
/** Where a shortcut works: everywhere, any question page, or one kind of question. */
type Where = 'everywhere' | 'question' | 'code' | 'machine-coding';

interface ShortcutDef {
  /** Alternatives, e.g. ⌘K or `/`. The first is the one hinted in tooltips. */
  keys: Combo[];
  label: string;
  group: string;
  where: Where;
}

const DEFS = {
  search: { keys: [['mod', 'K'], ['/']], label: 'Search questions, topics and notes', group: 'General', where: 'everywhere' },
  shortcuts: { keys: [['?']], label: 'Show keyboard shortcuts', group: 'General', where: 'everywhere' },
  sidebar: { keys: [['mod', 'B']], label: 'Collapse or expand the sidebar', group: 'General', where: 'everywhere' },

  run: { keys: [['mod', "'"]], label: 'Run the visible testcases', group: 'Question', where: 'code' },
  submit: { keys: [['mod', 'Enter']], label: 'Submit against every testcase', group: 'Question', where: 'code' },
  prev: { keys: [['alt', 'ArrowLeft']], label: 'Previous question', group: 'Question', where: 'question' },
  next: { keys: [['alt', 'ArrowRight']], label: 'Next question', group: 'Question', where: 'question' },
  description: { keys: [['alt', '1']], label: 'Show or hide the description', group: 'Question', where: 'question' },
  files: { keys: [['alt', '2']], label: 'Show or hide files', group: 'Question', where: 'machine-coding' },
  preview: { keys: [['alt', '3']], label: 'Show or hide the preview', group: 'Question', where: 'machine-coding' },
  resize: { keys: [['ArrowLeft'], ['ArrowRight']], label: 'Resize a focused divider', group: 'Question', where: 'question' },

  'palette-move': { keys: [['ArrowUp'], ['ArrowDown']], label: 'Move between results', group: 'Search', where: 'everywhere' },
  'palette-open': { keys: [['Enter']], label: 'Open the result', group: 'Search', where: 'everywhere' },
  'palette-actions': { keys: [['>']], label: 'Search commands (type it first)', group: 'Search', where: 'everywhere' },
  'palette-close': { keys: [['Escape']], label: 'Clear the search, then close', group: 'Search', where: 'everywhere' },

  'tree-move': { keys: [['ArrowUp'], ['ArrowDown']], label: 'Move between files', group: 'File tree', where: 'machine-coding' },
  'tree-fold': { keys: [['ArrowRight'], ['ArrowLeft']], label: 'Expand or collapse a folder', group: 'File tree', where: 'machine-coding' },
  'tree-open': { keys: [['Enter'], ['Space']], label: 'Open a file', group: 'File tree', where: 'machine-coding' },
  'tree-rename': { keys: [['F2']], label: 'Rename', group: 'File tree', where: 'machine-coding' },
  'tree-delete': { keys: [['Delete'], ['Backspace']], label: 'Delete (you can undo)', group: 'File tree', where: 'machine-coding' },

  'rail-open': { keys: [['ArrowRight'], ['Enter']], label: 'Open a section’s menu', group: 'Collapsed sidebar', where: 'everywhere' },
  'rail-close': { keys: [['Escape'], ['ArrowLeft']], label: 'Close the menu', group: 'Collapsed sidebar', where: 'everywhere' },
} satisfies Record<string, ShortcutDef>;

export type ShortcutId = keyof typeof DEFS;
export interface Shortcut extends ShortcutDef {
  id: ShortcutId;
}

export const SHORTCUTS: Shortcut[] = Object.entries(DEFS).map(([id, def]) => ({ id: id as ShortcutId, ...def }));

const MAC_KEYS: Record<string, string> = { mod: '⌘', alt: '⌥', shift: '⇧' };
const PC_KEYS: Record<string, string> = { mod: 'Ctrl', alt: 'Alt', shift: 'Shift' };
const KEY_GLYPHS: Record<string, string> = {
  ArrowLeft: '←',
  ArrowRight: '→',
  ArrowUp: '↑',
  ArrowDown: '↓',
  Enter: '↵',
  Escape: 'Esc',
  Delete: 'Del',
  Backspace: '⌫',
};

/** A combo as people read it on their keyboard: ['⌘', 'K'] or ['Ctrl', 'K']. */
export function displayCombo(combo: Combo, mac = isMac): string[] {
  return combo.map((k) => (mac ? MAC_KEYS : PC_KEYS)[k] ?? KEY_GLYPHS[k] ?? k);
}

interface FormatOptions {
  mac?: boolean;
  /** Between keys: ' ' for tooltips (`⌘ K`), '' for compact inline hints (`⌘K`). */
  separator?: string;
}

/** The primary combo, as a hint: `⌘ K`. */
export function keysFor(id: ShortcutId, { mac = isMac, separator = ' ' }: FormatOptions = {}): string {
  return displayCombo(DEFS[id].keys[0], mac).join(separator);
}

const ARIA_KEYS: Record<string, (mac: boolean) => string> = {
  mod: (mac) => (mac ? 'Meta' : 'Control'),
  alt: () => 'Alt',
  shift: () => 'Shift',
};

/** Every combo for `aria-keyshortcuts`: `Meta+K /`. */
export function ariaKeysFor(id: ShortcutId, { mac = isMac }: FormatOptions = {}): string {
  return DEFS[id].keys.map((combo) => combo.map((k) => ARIA_KEYS[k]?.(mac) ?? k).join('+')).join(' ');
}

const GROUP_ORDER = ['General', 'Question', 'Search', 'File tree', 'Collapsed sidebar'];

function worksIn(where: Where, context: ShortcutContext) {
  return where === 'everywhere' || where === context || (where === 'question' && context !== 'browse');
}

/** Shortcuts by group for a page: groups with something that works here come first. */
export function shortcutGroups(context: ShortcutContext) {
  const groups = GROUP_ORDER.map((group) => {
    const items = SHORTCUTS.filter((s) => s.group === group).map((s) => ({ ...s, here: worksIn(s.where, context) }));
    return { group, items, here: items.some((i) => i.here) };
  });
  return [...groups.filter((g) => g.here), ...groups.filter((g) => !g.here)];
}

/** Where a shortcut works, for the sheet's note on ones that don't work on this page. */
export function whereLabel(where: Where): string {
  return { everywhere: '', question: 'On question pages', code: 'On JS and DSA questions', 'machine-coding': 'On machine-coding questions' }[where];
}
