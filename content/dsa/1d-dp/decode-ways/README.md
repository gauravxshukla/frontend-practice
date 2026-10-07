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

- **Key insight:** the first letter of a decoding uses either one digit or two. That splits the problem into two smaller suffixes.
- **Recurrence:** with `ways(i)` = decodings of `s[i..]`, `ways(n) = 1` and `ways(i) = [s[i] ≠ '0'] · ways(i + 1) + [10 ≤ s[i..i+1] ≤ 26] · ways(i + 2)`.
- A `'0'` cannot start a group, so `ways(i) = 0` whenever `s[i] === '0'`. A zero only survives as the second digit of `10` or `20`.
- **Space optimisation:** each value reads the next two, so two rolling variables are enough. O(n) time, O(1) space. (The left-to-right version with `ways` of prefixes works the same way.)
- **Brute force:** recursively try a 1-digit and a 2-digit group at every position without caching. O(2ⁿ) on strings like `"1111…"`.
- Edge cases: `"0"` → 0, `"10"` → 1, `"100"` → 0 (the trailing zero is stranded), `"27"` → 1 (27 is not a letter), `"2101"` → 1.
- Pitfall: treating `"06"` as 6. Check the leading digit before parsing the pair.
- Follow-up: Decode Ways II adds a `*` wildcard for 1–9. The same recurrence applies with multiplicities, taken modulo 10⁹ + 7.
