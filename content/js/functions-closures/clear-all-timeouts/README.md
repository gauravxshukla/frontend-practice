---
title: Clear All Timeouts
type: js
difficulty: medium
topic: functions-closures
order: 12
tags: [timers, closures, set]
estimatedMinutes: 15
---

Implement `createTimeoutRegistry()`. It returns an object that wraps the global timer functions and remembers the timers it started, so they can all be cancelled at once:

- `setTimeout(fn, ms, ...args)` schedules `fn(...args)` after `ms` and returns the timer id.
- `clearTimeout(id)` cancels one timer started by this registry.
- `clearAllTimeouts()` cancels every timer from this registry that hasn't fired yet.

```js
const timers = createTimeoutRegistry();
timers.setTimeout(() => console.log('a'), 100);
const id = timers.setTimeout(() => console.log('b'), 200);
timers.clearTimeout(id); // 'b' will never log
timers.clearAllTimeouts(); // 'a' will never log either
```

**Constraints:**

- Don't replace or modify `globalThis.setTimeout` / `globalThis.clearTimeout`.
- Timers started outside the registry (or by another registry) are not affected.
- Once a timer fires or is cleared, the registry **forgets** it (it doesn't keep ids it no longer needs), so `clearAllTimeouts` never clears already-finished timers.
- The registry still works after `clearAllTimeouts()`.

## Notes

- **Approach:** a `Set` of pending ids in the closure. `setTimeout` calls the global one with a wrapper that deletes its own id before running `fn`, adds the id, and returns it. `clearTimeout` deletes the id and clears it. `clearAllTimeouts` clears every id in the set, then empties it.
- **Why delete on fire:** otherwise the set grows forever in a long-lived app and `clearAllTimeouts` does pointless work.
- **Why a Set:** O(1) add/delete and no duplicates.
- **Monkey-patch variant (the classic interview framing):** override `window.setTimeout` to record ids, and add `window.clearAllTimeouts`. Keep the originals in local variables and call them. It works, but it changes global behaviour for every library on the page, so prefer a wrapper (dependency injection) unless you're asked to patch.
- **Pitfall:** a timer callback that schedules another timer must have its new id tracked too. It is, because it goes through `registry.setTimeout`.
- **Complexity:** O(1) per set/clear, O(n) for `clearAllTimeouts`.
- **Follow-ups:** the same for intervals, a `pendingCount`, or tying cleanup to a component's unmount (`useEffect` cleanup, `AbortController`).
