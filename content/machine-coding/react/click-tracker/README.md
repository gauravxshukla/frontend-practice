---
title: Click Tracker (labels)
type: react
difficulty: medium
tags: [state, derived-state, tables]
estimatedMinutes: 25
---

Build a click tracker:

- An input and an **Add** button create a new label. The list starts with one label, "Default Label".
- Labels render as buttons in a table.
- Clicking a label increments **its** click count and shows `Latest Label clicked - <name> <count>`.
- When the clicked label is different from the previously clicked one, also show `Switched to Label <name>`. Clicking the same label again hides that line.

## Notes

- The reference is the original solution, kept as written. It works, but a reviewer would flag two things:
  - It **mutates state objects** (`currentLabel.count += 1` on a shallow-copied array). The display only updates because `labelSelected` holds the same object reference. Prefer `labels.map(l => l.id === id ? { ...l, count: l.count + 1 } : l)`.
  - It stores the selected label **object** in state (duplicated data). Store `selectedId` and derive `const selected = labels.find(l => l.id === selectedId)`, and keep `previousId` in state instead of a ref read during render.
- `labels.length + 1` as an id breaks once deletion exists. Use a counter ref or `crypto.randomUUID()`.
- Ignore empty names on Add.
