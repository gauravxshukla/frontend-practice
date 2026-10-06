---
title: Nested Dropdown Menu
type: react
difficulty: medium
tags: [recursion, accessibility, menus]
estimatedMinutes: 40
---

Build a dropdown menu whose items can open sub-menus to any depth.

- Menu data is a tree: `{ label, children? }`.
- Hovering or focusing an item with children opens its sub-menu to the side. Leaving closes it.
- Clicking a leaf selects it and closes the whole menu. Clicking outside closes the menu too.
- Keyboard: arrow keys move between items and in/out of sub-menus, and Escape closes.

Bonus: handle sub-menus that would overflow the viewport.
