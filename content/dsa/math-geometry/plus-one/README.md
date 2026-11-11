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

- **Identify:** add 1 to a number stored as a digit array → carry from the last digit leftward
- **Brute force:** convert to an integer, add 1, convert back; overflows for long arrays
- **Insight:** stop at the first digit that isn't 9; only trailing 9s turn into 0s
- **Steps:** from the right: if digit < 9, increment and return; else set it to 0; if all were 9, prepend 1
- **Complexity:** O(n) time either way, but no overflow; O(1) extra space (O(n) only for all 9s)
- **Pitfall:** all nines ([9, 9, 9]) grow by one digit: [1, 0, 0, 0]
- **Related:** Add Two Numbers, Multiply Strings, Sum of Two Integers
