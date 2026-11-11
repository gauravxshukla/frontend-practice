---
title: Multiply Strings
type: dsa
difficulty: medium
topic: math-geometry
order: 7
neetcode: true
tags: [strings, math, simulation]
estimatedMinutes: 25
---

You get two non-negative integers `num1` and `num2` written as decimal strings. Return their product, also as a decimal string with no leading zeros (the product zero is `"0"`).

The numbers can be far larger than JavaScript's safe integer range, so don't convert them to `Number`, and don't use `BigInt` either: do the multiplication digit by digit.

```js
function multiply(num1, num2) // → string
```

## Examples

```text
Input:  num1 = "2", num2 = "3"
Output: "6"

Input:  num1 = "123", num2 = "456"
Output: "56088"
```

## Constraints

- 1 ≤ `num1.length`, `num2.length` ≤ 200
- Both contain only digits
- No leading zeros, except the number 0 itself

## Notes

- **Identify:** multiply huge numbers given as strings → grade-school multiplication into a digit array
- **Key formula:** digits i and j (from the left) add their product at positions i + j and i + j + 1
- **Brute force:** convert to integers and multiply; overflows (and big-integer types are off-limits)
- **Insight:** every digit pair lands in a known slot of an m + n array; add carries as you go
- **Steps:** for each digit pair from the right, add the product into out[i + j + 1], carry into out[i + j]; strip leading zeros
- **Complexity:** O(m·n) time, O(m + n) space
- **Pitfall:** "0" times anything is "0", not an empty string after stripping zeros
- **Related:** Add Two Numbers, Plus One, Pow(x, n)
