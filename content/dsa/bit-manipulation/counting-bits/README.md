---
title: Counting Bits
type: dsa
difficulty: easy
topic: bit-manipulation
order: 3
neetcode: true
tags: [bit-manipulation, dynamic-programming]
estimatedMinutes: 15
---

You get a non-negative integer `n`. Return an array `ans` of length `n + 1` where `ans[i]` is the number of `1` bits in the binary form of `i`, for every `i` from `0` to `n`.

Try to do it in O(n) total time, without counting each number's bits from scratch.

```js
function countBits(n) // → number[]
```

## Examples

```text
Input:  n = 2
Output: [0,1,1]

Input:  n = 5
Output: [0,1,1,2,1,2]
Explanation: 0→0, 1→1, 10→1, 11→2, 100→1, 101→2.
```

## Constraints

- 0 ≤ n ≤ 10⁵

## Notes

- **Key insight:** `i >> 1` is `i` with its last bit dropped, and you already know its answer. So `ans[i] = ans[i >> 1] + (i & 1)`.
- Another recurrence: `ans[i] = ans[i & (i − 1)] + 1`, since `i & (i − 1)` removes the lowest set bit.
- Or by most-significant bit: `ans[i] = 1 + ans[i − offset]`, where `offset` is the largest power of two ≤ i.
- O(n) time, O(1) extra space besides the output.
- Brute force: popcount each number independently, O(n log n) (or O(32 n)).
- Edge case: `n = 0` returns `[0]`, an array of length 1.
- Pitfall: off-by-one. The array has `n + 1` entries and includes `n` itself.
- Follow-up: do it without any built-in popcount, which every recurrence above already satisfies.
