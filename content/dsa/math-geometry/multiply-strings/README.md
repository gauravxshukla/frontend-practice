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

- **Key insight:** digit `i` of `num1` times digit `j` of `num2` (counting from the left) lands at positions `i + j` and `i + j + 1` of a result array of length `m + n`.
- Allocate `res = new Array(m + n).fill(0)`. Loop `i` and `j` from the right: `sum = d1 * d2 + res[i + j + 1]`; `res[i + j + 1] = sum % 10`; `res[i + j] += Math.floor(sum / 10)`.
- At the end, strip leading zeros and join. If nothing is left, return `"0"`.
- O(m · n) time, O(m + n) space.
- Grade-school baseline: multiply `num1` by each digit of `num2`, shift, and add the partial products as strings. Same O(m · n) time, but more code and allocations.
- Pitfall: `Number("123...")` loses precision past 2⁵³, about 16 digits.
- Pitfall: returning `"000"` when either input is `"0"`. Short-circuit, or strip zeros carefully.
- Follow-up: Karatsuba multiplication brings this down to about O(n^1.585) for very large inputs.
