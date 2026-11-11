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

- **Identify:** repeat "sum of squared digits" until 1 or a loop → cycle detection (fast and slow)
- **Brute force:** remember every value in a set and stop on a repeat, O(log n) space per value seen
- **Insight:** the sequence either reaches 1 or loops forever, so Floyd's two pointers detect it without a set
- **Steps:** slow = next(n), fast = next(next(n)); advance until they meet; happy if they meet at 1
- **Complexity:** O(log n) time per step; O(k) → O(1) space
- **Pitfall:** 1 maps to itself, so a happy number also "cycles"; check the meeting value, not just the meeting
- **Related:** Linked List Cycle, Find the Duplicate Number, Plus One
