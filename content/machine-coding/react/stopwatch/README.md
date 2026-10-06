---
title: Stopwatch
type: react
difficulty: easy
tags: [timers, refs]
estimatedMinutes: 20
---

Build a stopwatch showing elapsed time as `mm:ss.ms`.

- **Start/Stop** toggles timing; **Reset** sets it back to 0.
- Clicking the time display also toggles start/stop.
- Time must stay accurate even if the interval drifts or the tab is backgrounded. Hint: base it on `Date.now()` deltas, not tick counts.
