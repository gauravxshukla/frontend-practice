---
title: File Explorer
type: react
difficulty: medium
tags: [recursion, state, tree]
estimatedMinutes: 30
---

`data.js` holds a nested file tree. An item with `children` is a **directory**; otherwise it's a file.

Build a file explorer:

- Render the tree recursively, indenting each level.
- Directories are collapsed initially. Clicking a directory toggles it open/closed.
- Within each level, list directories first, then files, each group sorted alphabetically.
- Show directory names differently from file names (e.g. bold, plus an open/closed indicator).

## Notes

- A recursive `<FileList items>` renders `<FileObject>` items, and a directory renders a nested `<FileList>` when expanded.
- Expanded state can live **in each directory component** (`useState(false)`), which is simplest. Lift it to a `Set` of ids at the top if you need "collapse all" or persistence.
- Sort a copy (`[...items].sort(...)`). Never sort props in place.
- The original attempt rendered the tree recursively but re-used `FileExplorer` (with its own state copy) as the recursive node, and had no expand/collapse. The reference splits list and node components.
- Accessibility follow-up: `role="tree"`/`treeitem`, `aria-expanded`, and arrow-key navigation (File Explorer II/III).
