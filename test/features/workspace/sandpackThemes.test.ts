import { describe, expect, it } from 'vitest';
import { editorFont } from '../../../src/features/workspace/sandpackThemes';

describe('editorFont', () => {
  it('uses 16px on touch screens so iOS does not zoom when the editor is focused', () => {
    expect(editorFont(true)).toMatchObject({ size: '16px', lineHeight: '24px' });
  });

  it('keeps the compact desktop size for mouse pointers', () => {
    expect(editorFont(false)).toMatchObject({ size: '13px', lineHeight: '20px' });
  });
});
