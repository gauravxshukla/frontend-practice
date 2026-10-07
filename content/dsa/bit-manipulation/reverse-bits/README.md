---
title: Reverse Bits
type: dsa
difficulty: easy
topic: bit-manipulation
order: 4
neetcode: true
tags: [bit-manipulation, divide-and-conquer]
estimatedMinutes: 15
---

You get an integer `n` that is an **unsigned 32-bit** value (0 to 2³² − 1). Write it as exactly 32 bits, including leading zeros, reverse the order of those bits, and return the result as an unsigned 32-bit number (also 0 to 2³² − 1, never negative).

JavaScript's bitwise operators return **signed** 32-bit results, so finish with `>>> 0` to turn the value back into an unsigned number.

```js
function reverseBits(n) // → number (unsigned 32-bit)
```

## Examples

```text
Input:  n = 43261596
Output: 964176192
Explanation: 00000010100101000001111010011100 reversed is 00111001011110000010100101000000 = 964176192.

Input:  n = 4294967293
Output: 3221225471
Explanation: 11111111111111111111111111111101 reversed is 10111111111111111111111111111111 = 3221225471.
```

## Constraints

- 0 ≤ n ≤ 2³² − 1

## Notes

- **Key insight:** peel bits off the right of `n` and push them onto the right of the result. After 32 steps, the first bit you peeled is in the top position.
- Loop 32 times: `result = (result << 1) | (n & 1)`, then `n >>>= 1`. Return `result >>> 0`.
- O(32) = O(1) time and space.
- JS pitfall: `result << 1` becomes negative once bit 31 is set. That bit pattern is still correct, but you must return `result >>> 0` to report it as unsigned.
- JS pitfall: use `>>>` rather than `>>` when shifting `n`, or inputs ≥ 2³¹ shift in 1s.
- Pitfall: stopping when `n` reaches 0 instead of always doing 32 iterations loses the trailing zeros, which become leading bits after the reverse.
- Baseline: `n.toString(2).padStart(32, "0")`, reverse the string, `parseInt(..., 2)`.
- Follow-up: if this is called many times, reverse a byte at a time with a 256-entry lookup table, or use the divide-and-conquer swaps (swap halves, then quarters, and so on down to single bits) with masks like `0x55555555`.
