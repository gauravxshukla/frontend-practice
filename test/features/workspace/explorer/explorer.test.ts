import { describe, expect, it } from 'vitest';
import { baseName, buildTree, dirOf, joinPath, type TreeNode } from '../../../../src/features/workspace/explorer/buildTree';
import { validateNewPath } from '../../../../src/features/workspace/explorer/validateNewPath';

const shape = (nodes: TreeNode[]): unknown =>
  nodes.map((n) => (n.kind === 'folder' ? { [n.name]: shape(n.children) } : n.name));

describe('buildTree', () => {
  it('nests paths, folders first, natural order', () => {
    const tree = buildTree(['/styles.css', '/App.js', '/components/Button.js', '/components/ui/Icon.js', '/file10.js', '/file2.js']);
    expect(shape(tree)).toEqual([{ components: [{ ui: ['Icon.js'] }, 'Button.js'] }, 'App.js', 'file2.js', 'file10.js', 'styles.css']);
  });

  it('includes empty pending folders', () => {
    expect(shape(buildTree(['/App.js'], ['/hooks', '/lib/utils']))).toEqual([{ hooks: [] }, { lib: [{ utils: [] }] }, 'App.js']);
  });

  it('path helpers', () => {
    expect(dirOf('/a/b.js')).toBe('/a');
    expect(dirOf('/b.js')).toBe('/');
    expect(baseName('/a/b.js')).toBe('b.js');
    expect(joinPath('/', 'x.js')).toBe('/x.js');
    expect(joinPath('/a', 'x.js')).toBe('/a/x.js');
  });
});

describe('validateNewPath', () => {
  const existing = ['/App.js', '/components/Button.js'];

  it('accepts a fresh name, including unicode', () => {
    expect(validateNewPath('utils.js', '/', { existing })).toBeNull();
    expect(validateNewPath('  héllo-✓.js ', '/components', { existing })).toBeNull();
  });

  it('rejects empty, slashes, reserved and overlong names', () => {
    expect(validateNewPath('   ', '/', { existing })).toMatch(/Enter a name/);
    expect(validateNewPath('a/b.js', '/', { existing })).toMatch(/slashes/);
    expect(validateNewPath('..', '/', { existing })).toMatch(/reserved/);
    expect(validateNewPath('x'.repeat(101), '/', { existing })).toMatch(/under 100/);
  });

  it('rejects names taken by a file, a folder or a pending folder', () => {
    expect(validateNewPath('App.js', '/', { existing })).toMatch(/already exists/);
    expect(validateNewPath('components', '/', { existing })).toMatch(/already exists/);
    expect(validateNewPath('hooks', '/', { existing, pendingFolders: ['/hooks'] })).toMatch(/already exists/);
  });

  it('lets a rename keep its own name', () => {
    expect(validateNewPath('Button.js', '/components', { existing, self: '/components/Button.js' })).toBeNull();
  });
});
