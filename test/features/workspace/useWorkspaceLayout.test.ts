import { describe, expect, it } from 'vitest';
import { filesOpenByDefault } from '../../../src/features/workspace/useWorkspaceLayout';

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
