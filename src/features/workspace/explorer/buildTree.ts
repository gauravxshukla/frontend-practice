// Turns Sandpack's flat file paths (`/components/Button.js`) into a folder tree.
// Sandpack has no notion of an empty folder, so folders the user just created
// (and hasn't put a file in yet) are passed separately as `pendingFolders`.

export interface TreeFile {
  kind: 'file';
  name: string;
  path: string;
}

export interface TreeFolder {
  kind: 'folder';
  name: string;
  path: string;
  children: TreeNode[];
}

export type TreeNode = TreeFile | TreeFolder;

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

/** `/a/b.js` → `/a`; `/b.js` → `/`. */
export function dirOf(path: string): string {
  const i = path.lastIndexOf('/');
  return i <= 0 ? '/' : path.slice(0, i);
}

export function baseName(path: string): string {
  return path.slice(path.lastIndexOf('/') + 1);
}

export function joinPath(parent: string, name: string): string {
  return parent === '/' ? `/${name}` : `${parent}/${name}`;
}

/** Folders first, then files; each group in natural order (`file2` before `file10`). */
function sortNodes(nodes: TreeNode[]) {
  nodes.sort((a, b) => (a.kind === b.kind ? collator.compare(a.name, b.name) : a.kind === 'folder' ? -1 : 1));
  for (const node of nodes) if (node.kind === 'folder') sortNodes(node.children);
}

export function buildTree(paths: string[], pendingFolders: string[] = []): TreeNode[] {
  const root: TreeNode[] = [];
  const folders = new Map<string, TreeFolder>();

  const folderAt = (path: string): TreeNode[] => {
    if (path === '/') return root;
    const existing = folders.get(path);
    if (existing) return existing.children;
    const folder: TreeFolder = { kind: 'folder', name: baseName(path), path, children: [] };
    folders.set(path, folder);
    folderAt(dirOf(path)).push(folder);
    return folder.children;
  };

  for (const folder of pendingFolders) folderAt(folder);
  for (const path of paths) folderAt(dirOf(path)).push({ kind: 'file', name: baseName(path), path });

  sortNodes(root);
  return root;
}
