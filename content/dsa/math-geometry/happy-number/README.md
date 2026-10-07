---
title: Happy Number
type: dsa
difficulty: easy
topic: math-geometry
order: 4
neetcode: true
tags: [math, hash-set, two-pointers, cycle-detection]
estimatedMinutes: 10
---

Start with a positive integer `n` and repeatedly replace it with the **sum of the squares of its digits**. A number is *happy* if this process eventually reaches `1`. Otherwise it loops forever through a cycle that never contains `1`.

Return `true` if `n` is happy, otherwise `false`.

```js
function isHappy(n) // → boolean
```

## Examples

```text
Input:  n = 19
Output: true
Explanation: 1² + 9² = 82 → 8² + 2² = 68 → 6² + 8² = 100 → 1² + 0² + 0² = 1.

Input:  n = 2
Output: false
Explanation: 2 → 4 → 16 → 37 → 58 → 89 → 145 → 42 → 20 → 4, a cycle without 1.
```

## Constraints

- 1 ≤ n ≤ 2³¹ − 1

## Notes

- **Key insight:** the sequence can't grow without bound. Any number with d digits maps to at most 81·d, so it quickly drops below a few hundred and must either hit 1 or repeat.
- So this is **cycle detection**. Keep a `Set` of numbers seen; stop when you hit 1 (happy) or a repeat (not happy). O(log n) per step, with a small constant number of steps.
- **O(1) space:** Floyd's tortoise and hare. `slow` takes one step, `fast` takes two. They either meet at 1 or meet inside the cycle.
- Digit-square sum: loop `while (x > 0) { d = x % 10; sum += d * d; x = Math.floor(x / 10); }`.
- Pitfall: integer division in JS. Use `Math.floor` (or `Math.trunc`); `x / 10` alone gives a float that never reaches 0.
- Fun fact: every unhappy number falls into the same 8-cycle 4 → 16 → 37 → 58 → 89 → 145 → 42 → 20 → 4, so checking for 4 also works.
- Follow-up: the same Floyd idea solves Linked List Cycle and Find the Duplicate Number.
