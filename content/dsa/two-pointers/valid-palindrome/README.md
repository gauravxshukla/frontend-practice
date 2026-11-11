---
title: Valid Palindrome
type: dsa
difficulty: easy
topic: two-pointers
order: 1
neetcode: true
tags: [strings, two-pointers]
estimatedMinutes: 10
---

You get a string `s`. Ignore every character that isn't a letter or a digit, and ignore upper/lower case. Return `true` if what remains reads the same forwards and backwards. A string with no letters or digits counts as a palindrome.

```js
function isPalindrome(s) // → boolean
```

## Examples

```text
Input:  s = "Was it a car or a cat I saw?"
Output: true
Explanation: it becomes "wasitacaroracatisaw".

Input:  s = "tab a cat"
Output: false
Explanation: "tabacat" reversed is "tacabat".

Input:  s = " "
Output: true
```

## Constraints

- 0 ≤ `s.length` ≤ 2 · 10⁵
- `s` contains printable ASCII characters.

## Notes

- **Identify:** reads the same both ways, ignoring case and symbols → two pointers from the ends
- **Brute force:** build a cleaned lowercase copy, reverse it and compare, O(n) time, O(n) space
- **Insight:** instead of building a copy, skip non-alphanumerics in place and compare from both ends
- **Steps:** l at start, r at end; skip non-alphanumerics; compare lowercase chars; move both inward
- **Complexity:** O(n) → O(n) time, O(n) → O(1) space
- **Pitfall:** digits count as characters ("0P" is false), and a string of only symbols is true
- **Related:** Two Sum II, Palindromic Substrings, Longest Palindromic Substring
