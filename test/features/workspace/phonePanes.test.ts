import { describe, expect, it } from 'vitest';
import { phonePanes, stepPane } from '../../../src/features/workspace/phonePanes';

describe('phonePanes', () => {
  it('gives code questions a Tests view', () => {
    expect(phonePanes(true)).toEqual(['problem', 'code', 'tests']);
  });

  it('gives machine-coding questions a Preview view', () => {
    expect(phonePanes(false)).toEqual(['problem', 'code', 'preview']);
  });
});

describe('stepPane', () => {
  const panes = phonePanes(true);

  it('moves with the arrow keys and wraps at both ends', () => {
    expect(stepPane(panes, 'problem', 'ArrowRight')).toBe('code');
    expect(stepPane(panes, 'tests', 'ArrowRight')).toBe('problem');
    expect(stepPane(panes, 'code', 'ArrowLeft')).toBe('problem');
    expect(stepPane(panes, 'problem', 'ArrowLeft')).toBe('tests');
  });

  it('jumps to the first and last view with Home and End', () => {
    expect(stepPane(panes, 'code', 'Home')).toBe('problem');
    expect(stepPane(panes, 'code', 'End')).toBe('tests');
  });

  it('starts from the first view when the current one is not in the list', () => {
    expect(stepPane(panes, 'preview', 'ArrowRight')).toBe('code');
  });
});
