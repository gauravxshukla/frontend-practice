---
title: Plus One
type: dsa
difficulty: easy
topic: math-geometry
order: 5
neetcode: true
tags: [arrays, math]
estimatedMinutes: 10
---

A non-negative integer is stored as an array of its decimal `digits`, most significant digit first. There are no leading zeros, except for the number 0 itself (`[0]`).

Add one to the number and return the result in the same digit-array format.

```js
function plusOne(digits) // → number[]
```

## Examples

```text
Input:  digits = [1,2,3]
Output: [1,2,4]

Input:  digits = [4,3,2,1]
Output: [4,3,2,2]

Input:  digits = [9]
Output: [1,0]
Explanation: 9 + 1 = 10, so the array grows by one digit.
```

## Constraints

- 1 ≤ `digits.length` ≤ 100
- 0 ≤ `digits[i]` ≤ 9
- No leading zeros except for `[0]`

## Notes

- **Key insight:** only trailing 9s are affected by a carry. Walk from the end: a digit below 9 just gets `+1` and you're done; a 9 becomes 0 and the carry moves left.
- If every digit was 9, the result is a 1 followed by all zeros, one digit longer.
- O(n) time worst case (all 9s), O(1) extra space unless the array grows.
- Pitfall: converting to a `Number`, adding 1, and splitting back. That loses precision past 2⁵³ (about 16 digits). `BigInt` works but misses the point of the exercise.
- Pitfall: forgetting the all-9s case and returning `[0, 0, 0]` for `[9, 9, 9]`.
- Decide whether you may mutate the input. Copying first (`[...digits]`) is the safer default.
- Follow-up: Add Binary or Add Strings, which add two digit strings with a general carry.
