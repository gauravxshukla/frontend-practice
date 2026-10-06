---
title: Maximum Product Subarray
type: dsa
difficulty: medium
tags: [arrays, dynamic-programming, blind75]
estimatedMinutes: 20
---

Given a non-empty integer array, return the largest product of any **contiguous**, non-empty subarray.

```js
maxProduct([2, 3, -2, 4]);  // 6  ([2, 3])
maxProduct([-2, 0, -1]);    // 0
maxProduct([-2, 3, -4]);    // 24 (the whole array)
```

## Notes

- Track **both** the max and the min product ending at each index, because multiplying by a negative swaps them.
- At each `n`: `candidates = [n, n * max, n * min]`, then `max = Math.max(...candidates)`, `min = Math.min(...candidates)`, and update the answer.
- A zero resets both to 0, and the `n` candidate restarts from the next element.
- O(n) time, O(1) space.
