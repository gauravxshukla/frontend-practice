import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { useSandpack } from '@codesandbox/sandpack-react';
import {
  ChevronRight,
  File as FileIcon,
  FilePlus,
  Folder,
  FolderOpen,
  FolderPlus,
  PanelLeftClose,
  Pencil,
  Trash2,
} from 'lucide-react';
import { useToast } from '../../../components/overlay/ToastProvider';
import { buildTree, dirOf, joinPath, type TreeNode } from './buildTree';
import { validateNewPath } from './validateNewPath';

type Editing =
  | { mode: 'new-file' | 'new-folder'; parent: string }
  | { mode: 'rename'; path: string; kind: TreeNode['kind'] };

interface NameInputProps {
  initial: string;
  label: string;
  validate: (name: string) => string | null;
  onSubmit: (name: string) => void;
  onCancel: () => void;
}

/** Inline name field: Enter confirms, Esc cancels, blur confirms a valid name. */
function NameInput({ initial, label, validate, onSubmit, onCancel }: NameInputProps) {
  const [value, setValue] = useState(initial);
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // Enter (or Esc) is followed by a blur when the input unmounts; act only once.
  const settled = useRef(false);
  const errorId = useId();
  const error = touched ? validate(value) : null;

  useEffect(() => {
    // Renaming `Button.js` selects `Button`, like editors do.
    const dot = initial.lastIndexOf('.');
    inputRef.current?.setSelectionRange(0, dot > 0 ? dot : initial.length);
  }, [initial]);

  const submit = () => {
    if (settled.current) return;
    if (validate(value)) {
      setTouched(true);
      return;
    }
    settled.current = true;
    onSubmit(value.trim());
  };

  const cancel = () => {
    if (settled.current) return;
    settled.current = true;
    onCancel();
  };

  return (
    <span className="explorer-input-wrap">
      <input
        ref={inputRef}
        autoFocus
        className="explorer-input"
        aria-label={label}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setTouched(true);
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          // Keep the tree's arrow/F2/Delete handling out of the text field.
          e.stopPropagation();
          if (e.key === 'Enter') {
            e.preventDefault();
            submit();
          } else if (e.key === 'Escape') {
            e.preventDefault();
            cancel();
          }
        }}
        onBlur={() => (value.trim() && !validate(value) ? submit() : cancel())}
      />
      {error && (
        <span id={errorId} className="explorer-error" role="alert">
          {error}
        </span>
      )}
    </span>
  );
}

interface FileExplorerProps {
  /** Template internals the user shouldn't see or edit (`/package.json`…). */
  hidden: string[];
  /** Entry files that can't be renamed or deleted; the first is reopened if every tab would close. */
  protectedPaths: string[];
  readOnly?: boolean;
  onCollapse: () => void;
}

const levelStyle = (level: number) => ({ '--level': level }) as CSSProperties;

/** Folder tree for the sandbox: open files, and create / rename / delete files and folders. */
export default function FileExplorer({ hidden, protectedPaths, readOnly = false, onCollapse }: FileExplorerProps) {
  const { sandpack } = useSandpack();
  const { files, activeFile, visibleFiles, openFile, addFile, deleteFile } = sandpack;
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set());
  const [pendingFolders, setPendingFolders] = useState<string[]>([]);
  const [editing, setEditing] = useState<Editing | null>(null);
  // New items go here: the folder last clicked, or the folder of the file last clicked.
  const [targetFolder, setTargetFolder] = useState('/');
  const treeRef = useRef<HTMLUListElement>(null);
  const toast = useToast();

  const allPaths = useMemo(() => Object.keys(files), [files]);
  const paths = useMemo(() => {
    const skip = new Set(hidden);
    return allPaths.filter((p) => !skip.has(p) && !files[p].hidden);
  }, [allPaths, files, hidden]);
  // A new folder stops being "pending" once a file lives in it.
  const pending = useMemo(
    () => pendingFolders.filter((f) => !paths.some((p) => p.startsWith(`${f}/`))),
    [pendingFolders, paths],
  );
  const tree = useMemo(() => buildTree(paths, pending), [paths, pending]);
  const nodeByPath = useMemo(() => {
    const map = new Map<string, TreeNode>();
    const walk = (nodes: TreeNode[]) =>
      nodes.forEach((n) => {
        map.set(n.path, n);
        if (n.kind === 'folder') walk(n.children);
      });
    walk(tree);
    return map;
  }, [tree]);

  const protectedSet = useMemo(() => new Set(protectedPaths), [protectedPaths]);
  const filesUnder = (folder: string) => paths.filter((p) => p.startsWith(`${folder}/`));
  const isLocked = (node: TreeNode) =>
    node.kind === 'file' ? protectedSet.has(node.path) : filesUnder(node.path).some((p) => protectedSet.has(p));
  const canEdit = (node: TreeNode) => !readOnly && !isLocked(node);

  const expand = (folder: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      for (let f = folder; f !== '/'; f = dirOf(f)) next.delete(f);
      return next;
    });

  const toggleFolder = (path: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });

  // Closing every tab makes Sandpack fall back to an arbitrary (often hidden) file.
  const keepATabOpen = (removing: string[]) => {
    const entry = protectedPaths[0];
    if (entry && !visibleFiles.some((f) => !removing.includes(f))) openFile(entry);
  };

  const activate = (node: TreeNode) => {
    if (node.kind === 'folder') {
      toggleFolder(node.path);
      setTargetFolder(node.path);
    } else {
      openFile(node.path);
      setTargetFolder(dirOf(node.path));
    }
  };

  const startCreate = (mode: 'new-file' | 'new-folder') => {
    expand(targetFolder);
    setEditing({ mode, parent: targetFolder });
  };

  const create = (mode: 'new-file' | 'new-folder', parent: string, name: string) => {
    const path = joinPath(parent, name);
    setEditing(null);
    expand(parent);
    if (mode === 'new-folder') {
      setPendingFolders((prev) => [...prev, path]);
      setTargetFolder(path);
    } else {
      addFile(path, '');
      openFile(path);
    }
  };

  // Sandpack has no rename: add under the new path, reopen, then delete the old one.
  // Opening before deleting keeps a tab open the whole time.
  const rename = (path: string, kind: TreeNode['kind'], name: string) => {
    const next = joinPath(dirOf(path), name);
    setEditing(null);
    if (next === path) return;
    const moved = kind === 'file' ? [path] : filesUnder(path);
    const target = (p: string) => next + p.slice(path.length);
    if (moved.length) {
      addFile(Object.fromEntries(moved.map((p) => [target(p), files[p].code])));
      // Reopen moved tabs, the active one last so it stays active.
      const reopen = moved.filter((p) => visibleFiles.includes(p) && p !== activeFile);
      if (moved.includes(activeFile)) reopen.push(activeFile);
      reopen.forEach((p) => openFile(target(p)));
      moved.forEach((p) => deleteFile(p));
    }
    if (kind === 'folder') {
      const inside = (f: string) => f === path || f.startsWith(`${path}/`);
      setPendingFolders((prev) => prev.map((f) => (inside(f) ? target(f) : f)));
      if (inside(targetFolder)) setTargetFolder(target(targetFolder));
    }
  };

  // No confirm: delete straight away and offer Undo, which puts back the files
  // (with their code), any empty folders, and the tabs that were open.
  const remove = (node: TreeNode) => {
    const isFolder = node.kind === 'folder';
    const inFolder = (f: string) => f === node.path || f.startsWith(`${node.path}/`);
    const removing = isFolder ? filesUnder(node.path) : [node.path];
    const snapshot = {
      files: Object.fromEntries(removing.map((p) => [p, files[p].code])),
      folders: isFolder ? pendingFolders.filter(inFolder) : [],
      // Reopen the tabs that were open, the active one last so it's active again.
      tabs: [...visibleFiles.filter((p) => removing.includes(p) && p !== activeFile), ...(removing.includes(activeFile) ? [activeFile] : [])],
    };

    keepATabOpen(removing);
    removing.forEach((p) => deleteFile(p));
    if (isFolder) {
      setPendingFolders((prev) => prev.filter((f) => !inFolder(f)));
      if (inFolder(targetFolder)) setTargetFolder(dirOf(node.path));
    }

    const count = removing.length;
    toast.show({
      message: isFolder
        ? `Deleted folder ${node.name}${count ? ` (${count} file${count === 1 ? '' : 's'})` : ''}`
        : `Deleted ${node.name}`,
      action: {
        label: 'Undo',
        done: `Restored ${node.name}`,
        run: () => {
          if (count) addFile(snapshot.files);
          if (snapshot.folders.length) setPendingFolders((prev) => [...new Set([...prev, ...snapshot.folders])]);
          snapshot.tabs.forEach((p) => openFile(p));
        },
      },
    });
  };

  const validateIn = (parent: string, self?: string) => (name: string) =>
    validateNewPath(name, parent, { existing: allPaths, pendingFolders: pending, self });

  const onTreeKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const item = (e.target as HTMLElement).closest<HTMLElement>('[role="treeitem"]');
    const node = item?.dataset.path ? nodeByPath.get(item.dataset.path) : undefined;
    if (!item || !node || !treeRef.current) return;
    const items = Array.from(treeRef.current.querySelectorAll<HTMLElement>('[role="treeitem"]'));
    const i = items.indexOf(item);
    const isOpenFolder = node.kind === 'folder' && !collapsed.has(node.path);
    switch (e.key) {
      case 'ArrowDown':
        items[i + 1]?.focus();
        break;
      case 'ArrowUp':
        items[i - 1]?.focus();
        break;
      case 'ArrowRight':
        if (node.kind === 'folder' && !isOpenFolder) toggleFolder(node.path);
        else if (isOpenFolder) items[i + 1]?.focus();
        break;
      case 'ArrowLeft':
        if (isOpenFolder) toggleFolder(node.path);
        else items.find((el) => el.dataset.path === dirOf(node.path))?.focus();
        break;
      case 'Enter':
      case ' ':
        activate(node);
        break;
      case 'F2':
        if (canEdit(node)) setEditing({ mode: 'rename', path: node.path, kind: node.kind });
        break;
      case 'Delete':
      case 'Backspace':
        if (canEdit(node)) remove(node);
        break;
      default:
        return;
    }
    e.preventDefault();
  };

  // Roving tabindex: Tab lands on the open file (or the first item), arrows do the rest.
  const focusPath = nodeByPath.has(activeFile) ? activeFile : tree[0]?.path;

  const renderNodes = (nodes: TreeNode[], level: number, parent: string): ReactNode => (
    <>
      {editing && editing.mode !== 'rename' && editing.parent === parent && (
        <li className="explorer-item" role="none">
          <div className="explorer-row editing" style={levelStyle(level)}>
            <span className="explorer-caret-space" />
            {editing.mode === 'new-folder' ? <Folder size={14} aria-hidden /> : <FileIcon size={14} aria-hidden />}
            <NameInput
              initial=""
              label={editing.mode === 'new-folder' ? 'New folder name' : 'New file name'}
              validate={validateIn(parent)}
              onSubmit={(name) => create(editing.mode, parent, name)}
              onCancel={() => setEditing(null)}
            />
          </div>
        </li>
      )}
      {nodes.map((node) => {
        const isFolder = node.kind === 'folder';
        const open = isFolder && !collapsed.has(node.path);
        const active = node.path === activeFile;
        const renaming = editing?.mode === 'rename' && editing.path === node.path;
        const editable = canEdit(node);
        return (
          <li
            key={node.path}
            className="explorer-item"
            role="treeitem"
            aria-level={level + 1}
            aria-expanded={isFolder ? open : undefined}
            aria-selected={isFolder ? undefined : active}
            tabIndex={node.path === focusPath ? 0 : -1}
            data-path={node.path}
          >
            <div
              className={`explorer-row${active ? ' active' : ''}`}
              style={levelStyle(level)}
              data-tooltip={node.path}
              data-tooltip-side="right"
              onClick={() => activate(node)}
              onDoubleClick={() => editable && !isFolder && setEditing({ mode: 'rename', path: node.path, kind: node.kind })}
            >
              {isFolder ? (
                <ChevronRight size={13} className={`explorer-caret${open ? ' open' : ''}`} aria-hidden />
              ) : (
                <span className="explorer-caret-space" />
              )}
              {isFolder ? (
                open ? <FolderOpen size={14} aria-hidden /> : <Folder size={14} aria-hidden />
              ) : (
                <FileIcon size={14} aria-hidden />
              )}
              {renaming ? (
                <NameInput
                  initial={node.name}
                  label={`Rename ${node.name}`}
                  validate={validateIn(dirOf(node.path), node.path)}
                  onSubmit={(name) => rename(node.path, node.kind, name)}
                  onCancel={() => setEditing(null)}
                />
              ) : (
                <span className="explorer-name">{node.name}</span>
              )}
              {editable && !renaming && (
                <span className="explorer-item-actions">
                  <button
                    type="button"
                    tabIndex={-1}
                    data-tooltip="Rename"
                    data-tooltip-kbd="F2"
                    aria-label={`Rename ${node.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditing({ mode: 'rename', path: node.path, kind: node.kind });
                    }}
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    type="button"
                    tabIndex={-1}
                    data-tooltip="Delete"
                    data-tooltip-kbd="Del"
                    aria-label={`Delete ${node.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(node);
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                </span>
              )}
            </div>
            {isFolder && open && <ul role="group">{renderNodes(node.children, level + 1, node.path)}</ul>}
          </li>
        );
      })}
    </>
  );

  return (
    <nav className="explorer" aria-label="Files">
      <div className="pane-bar">
        <span className="pane-title">Files</span>
        <div className="pane-actions">
          {!readOnly && (
            <>
              <button type="button" className="icon-btn" data-tooltip="New file" aria-label="New file" onClick={() => startCreate('new-file')}>
                <FilePlus size={14} />
              </button>
              <button type="button" className="icon-btn" data-tooltip="New folder" aria-label="New folder" onClick={() => startCreate('new-folder')}>
                <FolderPlus size={14} />
              </button>
            </>
          )}
          <button type="button" className="icon-btn" data-tooltip="Hide files" aria-label="Hide files" onClick={onCollapse}>
            <PanelLeftClose size={14} />
          </button>
        </div>
      </div>
      <ul ref={treeRef} className="explorer-tree" role="tree" aria-label="Files" onKeyDown={onTreeKeyDown}>
        {renderNodes(tree, 0, '/')}
      </ul>
    </nav>
  );
}
