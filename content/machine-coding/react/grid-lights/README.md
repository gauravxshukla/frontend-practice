---
title: Grid Lights
type: react
difficulty: medium
tags: [state, timers]
estimatedMinutes: 30
---

Render a 3×3 grid of cells where the centre cell is empty and not clickable.

- Clicking a cell turns it green.
- Once **all** 8 cells are active, they deactivate one by one in **reverse order of activation**, 300ms apart.
- While deactivating, clicks are ignored.
