---
title: Number of 1 Bits
type: dsa
difficulty: easy
topic: bit-manipulation
order: 2
neetcode: true
tags: [bit-manipulation, math]
estimatedMinutes: 10
---

You get a non-negative integer `n` that fits in 32 bits (treat it as **unsigned**, so it can be as large as 2³² − 1). Return how many `1` bits its binary representation has. This count is also called the *Hamming weight*.

```js
function hammingWeight(n) // → number
```

## Examples

```text
Input:  n = 11
Output: 3
Explanation: 11 is 1011 in binary: three 1 bits.

Input:  n = 128
Output: 1
Explanation: 128 is 10000000: one 1 bit.

Input:  n = 2147483645
Output: 30
```

## Constraints

- 0 ≤ n ≤ 2³² − 1

## Notes

- **Key insight (Brian Kernighan):** `n & (n − 1)` clears the lowest set bit. Repeat until `n` is 0 and count the iterations, which takes exactly as many steps as there are 1 bits.
- Simple alternative: check `n & 1` and shift with `n >>>= 1`, 32 iterations at most.
- O(number of set bits) or O(32) time, O(1) space.
- JS pitfall: bitwise operators work on **signed** 32-bit ints. For n ≥ 2³¹, `n >> 1` drags the sign bit in forever, so use `>>>` (unsigned shift), or apply `>>> 0` to get back an unsigned value.
- JS pitfall: `while (n > 0)` fails once `n & (n − 1)` turns the value negative. Normalise with `>>> 0` or loop on `n !== 0`.
- Baseline: `n.toString(2)` and count the `"1"` characters. Fine in an interview only as a first step.
- Follow-up: if this is called many times, precompute popcounts for every byte (256 entries) and add four table lookups.
- Related: Counting Bits computes the counts for every number from 0 to n in O(n).
