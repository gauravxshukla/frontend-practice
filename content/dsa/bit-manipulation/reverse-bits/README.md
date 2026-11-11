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

- **Identify:** reverse the 32 bits of an unsigned integer → shift bits out of n and into the result
- **Brute force:** convert to a 32-character binary string, reverse it and parse it back
- **Insight:** take n's lowest bit each step and push it onto the result from the right, 32 times
- **Steps:** repeat 32 times: result = (result << 1) | (n & 1); n >>= 1
- **Complexity:** O(32) time either way, O(1) space without the string
- **Pitfall:** loop exactly 32 times (leading zeros matter), and keep the result unsigned
- **Related:** Number of 1 Bits, Reverse Integer, Counting Bits
