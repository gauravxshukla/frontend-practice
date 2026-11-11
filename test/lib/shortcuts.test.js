import { globSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ariaKeysFor, displayCombo, keysFor, SHORTCUTS, shortcutGroups } from '../../src/lib/shortcuts';

describe('shortcuts', () => {
  it('has unique ids, each with at least one combo, a label and a group', () => {
    expect(new Set(SHORTCUTS.map((s) => s.id)).size).toBe(SHORTCUTS.length);
    SHORTCUTS.forEach((s) => {
      expect(s.keys.length).toBeGreaterThan(0);
      expect(s.label).toBeTruthy();
      expect(s.group).toBeTruthy();
    });
  });

  it('shows ⌘ / ⌥ on a Mac and Ctrl / Alt elsewhere', () => {
    expect(keysFor('search', { mac: true })).toBe('⌘ K');
    expect(keysFor('search', { mac: false })).toBe('Ctrl K');
    expect(keysFor('prev', { mac: true })).toBe('⌥ ←');
    expect(keysFor('prev', { mac: false })).toBe('Alt ←');
    expect(keysFor('submit', { mac: true, separator: '' })).toBe('⌘↵');
    expect(displayCombo(['shift', 'Escape'], false)).toEqual(['Shift', 'Esc']);
  });

  it('lists every alternative for aria-keyshortcuts', () => {
    expect(ariaKeysFor('search', { mac: true })).toBe('Meta+K /');
    expect(ariaKeysFor('run', { mac: false })).toBe("Control+'");
    expect(ariaKeysFor('description', { mac: true })).toBe('Alt+1');
  });

  it('puts the groups that work on this page first', () => {
    const browse = shortcutGroups('browse');
    expect(browse.filter((g) => g.here).map((g) => g.group)).toEqual(['General', 'Search', 'Collapsed sidebar']);
    expect(browse.at(-1).here).toBe(false);
    const mc = shortcutGroups('machine-coding');
    expect(mc.every((g) => g.here)).toBe(true);
    const question = mc.find((g) => g.group === 'Question');
    expect(question.items.find((i) => i.id === 'run').here).toBe(false); // Run is for code questions
    expect(question.items.find((i) => i.id === 'files').here).toBe(true);
  });

  it('documents every shortcut id the app hints at', () => {
    const ids = new Set(SHORTCUTS.map((s) => s.id));
    const used = globSync('src/**/*.{ts,tsx}').flatMap((file) =>
      [...readFileSync(file, 'utf8').matchAll(/(?:keysFor|ariaKeysFor)\('([^']+)'/g)].map((m) => `${m[1]} (${file})`),
    );
    expect(used.length).toBeGreaterThan(5);
    expect(used.filter((u) => !ids.has(u.split(' ')[0]))).toEqual([]);
  });
});
