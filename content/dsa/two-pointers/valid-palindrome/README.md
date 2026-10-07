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

- **Two pointers (optimal):** `left` starts at 0 and `right` at the end. Skip non-alphanumeric characters on either side, then compare lowercase characters. On a mismatch return `false`, otherwise move both inward.
- O(n) time and O(1) extra space.
- **Baseline:** build the cleaned lowercase string and compare it with its reverse. It's O(n) time but O(n) extra space, and it's perfectly fine as a first answer.
- Pitfall: digits count. `"0P"` is **not** a palindrome. A regex like `[a-z]` alone gets this wrong.
- Pitfall: `_` is not alphanumeric, but `\w` in a regex matches it.
- Pitfall: forgetting `left < right` in the skip loops can run past the other pointer or off the string.
- Follow-up: "Valid Palindrome II", where you may delete at most one character. On the first mismatch, try skipping either side.
