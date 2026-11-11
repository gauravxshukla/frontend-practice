import { describe, expect, it } from 'vitest';
import { applyDraft, parseDraft } from './drafts';

const starter = { '/App.js': 'starter app', '/styles.css': 'starter css' };

describe('drafts', () => {
  it('reads v1 drafts (a plain file map) as edits merged over the starter', () => {
    const draft = parseDraft(JSON.stringify({ '/App.js': 'edited' }));
    expect(draft).toEqual({ files: { '/App.js': 'edited' }, complete: false });
    expect(applyDraft(starter, draft)).toEqual({ '/App.js': 'edited', '/styles.css': 'starter css' });
  });

  it('reads v2 drafts as the complete file set, so deleted files stay deleted', () => {
    const draft = parseDraft(JSON.stringify({ v: 2, files: { '/App.js': 'edited', '/components/Button.js': 'new' } }));
    expect(applyDraft(starter, draft)).toEqual({ '/App.js': 'edited', '/components/Button.js': 'new' });
  });

  it('treats missing or corrupt drafts as no draft', () => {
    expect(parseDraft(null)).toBeNull();
    expect(parseDraft('{not json')).toBeNull();
    expect(parseDraft(JSON.stringify({ v: 2, files: { '/App.js': 42 } }))).toBeNull();
    expect(parseDraft(JSON.stringify(['x']))).toBeNull();
    expect(applyDraft(starter, null)).toBe(starter);
  });
});
