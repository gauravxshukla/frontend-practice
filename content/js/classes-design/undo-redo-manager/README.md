---
title: Undo/Redo Manager
type: js
difficulty: medium
topic: classes-design
order: 4
tags: [classes, stacks, state-management, design]
estimatedMinutes: 25
---

Implement `class History` (the default export), which wraps a value and records its changes so they can be undone and redone.

```js
new History(initial, { limit } = {});
```

- `get()` returns the current value.
- `set(next)` makes `next` the current value, records the previous value as one undo step, **clears the redo stack**, and returns `next`.
- `undo()` restores the previous value and returns it. `redo()` re-applies the last undone value and returns it. With nothing to undo or redo, they are **no-ops** that return the current value.
- `canUndo()` / `canRedo()` return booleans.
- `limit` (default: unlimited) caps the number of undo steps kept. When it is exceeded, the **oldest** step is dropped. `limit: 0` disables undo.
- `batch(fn)` calls `fn()`. Every `set` made inside `fn` changes the value straight away, but together they form **one** undo step. A batch with no `set` calls records nothing. If `fn` throws, the value is restored to what it was before the batch, nothing is recorded, and the error is rethrown. `batch` returns the current value. A `batch` inside a batch is part of the outer one.

```js
const h = new History('a');
h.set('b');
h.set('c');
h.undo(); // 'b'
h.redo(); // 'c'

h.batch(() => {
  h.set('d');
  h.set('e');
});
h.undo(); // 'c': the whole batch is one step
```

**Constraints:** values can be anything, including `undefined` and `null`; return them as-is (no copying). Instances are independent.

## Notes

- **Approach:** the classic three-part model: a `past` stack, a `present` value and a `future` stack. `set` pushes `present` onto `past`; `undo` moves `present` to `future` and pops `past`; `redo` does the reverse.
- **Why `set` clears `future`:** after a new change, the undone branch no longer follows from the current value. (Tools like Vim keep an undo *tree* instead.)
- **Limit:** after pushing, `shift()` the oldest entry while `past.length > limit`. For large limits a ring buffer avoids the O(n) shift.
- **Batching:** remember the value at the start of the outermost batch and a "changed" flag; while batching, `set` only updates `present`. At the end, if anything changed, push the start value as a single step and clear `future`. Restoring on throw keeps the history consistent.
- **Complexity:** O(1) per operation (amortised; `shift` is O(limit)).
- **Follow-ups:**
  - **Memory:** for large values store diffs/patches (Immer's `produceWithPatches`) or commands with `do`/`undo` instead of snapshots.
  - **Coalescing:** merge rapid edits such as typing into one step with a time window.
  - **Command pattern:** each action knows how to invert itself.
  - **React:** a `useHistory` hook built on this class.
