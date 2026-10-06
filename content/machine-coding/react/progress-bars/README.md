---
title: Progress Bars
type: react
difficulty: medium
tags: [timers, animation, async]
estimatedMinutes: 30
---

Build an **Add** button that appends a progress bar. Each bar fills from 0 to 100% over 2 seconds.

- **I:** bars start filling immediately when added.
- **II:** at most 3 bars fill concurrently; the rest wait their turn.
- **III:** add pause/resume for all bars.
- **IV:** use `requestAnimationFrame`-style timing instead of CSS transitions, so progress is exact.
