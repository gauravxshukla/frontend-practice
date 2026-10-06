---
title: Traffic Light
type: react
difficulty: easy
tags: [timers, state-machine]
estimatedMinutes: 20
---

Build a traffic light that cycles green → yellow → red → green.

- Durations: green 3000ms, yellow 500ms, red 4000ms.
- Only one light is lit at a time.
- Drive it from a config object (`{ green: { duration, next } ... }`), not hard-coded if/else.
