import { describe, expect, it } from 'vitest';
import { filesOpenByDefault, resolveFilesOpen } from '../../../src/features/workspace/useWorkspaceLayout';

describe('filesOpenByDefault', () => {
  it('keeps the tree closed when a few editor tabs are enough', () => {
    expect(filesOpenByDefault(['/App.js', '/styles.css'])).toBe(false);
    expect(filesOpenByDefault(['/App.js', '/styles.css', '/data.js'])).toBe(false);
    expect(filesOpenByDefault([])).toBe(false);
  });

  it('opens it for more than three files', () => {
    expect(filesOpenByDefault(['/App.js', '/styles.css', '/data.js', '/utils.js'])).toBe(true);
  });

  it('opens it as soon as there is a folder', () => {
    expect(filesOpenByDefault(['/App.js', '/components/Button.js'])).toBe(true);
  });
});

describe('resolveFilesOpen', () => {
  const many = ['/App.js', '/styles.css', '/data.js', '/utils.js'];
  const few = ['/App.js', '/styles.css'];

  it('keeps the user’s choice whatever the width', () => {
    expect(resolveFilesOpen(true, false, few)).toBe(true);
    expect(resolveFilesOpen(false, true, many)).toBe(false);
  });

  it('opens on a wide window when the tree helps', () => {
    expect(resolveFilesOpen(null, true, many)).toBe(true);
    expect(resolveFilesOpen(null, true, ['/App.js', '/components/Button.js'])).toBe(true);
  });

  it('stays closed on a narrow window or with only a few flat files', () => {
    expect(resolveFilesOpen(null, false, many)).toBe(false);
    expect(resolveFilesOpen(null, true, few)).toBe(false);
  });
});
