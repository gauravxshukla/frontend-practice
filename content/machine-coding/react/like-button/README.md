---
title: Like Button
type: react
difficulty: easy
tags: [async, fetch, states]
estimatedMinutes: 20
---

Build a heart-shaped **Like** button with default, hover, loading, liked and error states.

- Clicking it sends a request (simulate it with a promise that fails ~30% of the time).
- While loading, show a spinner and disable the button.
- On success, toggle liked/unliked. On failure, keep the previous state and show the error message under the button.
