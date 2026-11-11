---
title: Decode Ways
type: dsa
difficulty: medium
topic: 1d-dp
order: 7
neetcode: true
tags: [dynamic-programming, strings]
estimatedMinutes: 20
---

Letters were encoded as numbers, `A → "1"`, `B → "2"`, …, `Z → "26"`, and the numbers were concatenated with no separators. Given the digit string `s`, return how many **different letter strings** could have produced it. A group may not start with `0`, so `"06"` is not a valid code, and if no decoding exists the answer is `0`.

```js
function numDecodings(s) // → number
```

## Examples

```text
Input:  s = "12"
Output: 2
Explanation: "AB" (1 2) or "L" (12).

Input:  s = "226"
Output: 3
Explanation: "BZ" (2 26), "VF" (22 6) or "BBF" (2 2 6).

Input:  s = "06"
Output: 0
Explanation: "06" is not a valid group, and "0" maps to nothing.
```

## Constraints

- 1 ≤ `s.length` ≤ 100
- `s` contains only digits and may contain leading zeros
- The answer fits in a 32-bit integer

## Notes

- **Identify:** ways to split digits into codes 1–26 → DP: each position takes one or two digits
- **Key formula:** ways(i) = (s[i−1] ≠ "0" ? ways(i − 1) : 0) + (10 ≤ s[i−2..i−1] ≤ 26 ? ways(i − 2) : 0)
- **Brute force:** try every split recursively, O(2^n)
- **Insight:** a prefix's count only depends on the previous two prefixes, so two variables are enough
- **Steps:** ways(0) = 1; for each i add the one-digit and two-digit cases when valid; roll the pair forward
- **Complexity:** O(2^n) → O(n) time, O(1) space
- **Pitfall:** "0" alone decodes to nothing ("06" → 0), and "10"/"20" are only valid as pairs
- **Related:** Climbing Stairs, Word Break, Palindrome Partitioning
