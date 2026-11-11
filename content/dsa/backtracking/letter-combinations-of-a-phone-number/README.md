---
title: Letter Combinations of a Phone Number
type: dsa
difficulty: medium
topic: backtracking
order: 8
neetcode: true
tags: [backtracking, strings, recursion, hash-map]
estimatedMinutes: 15
---

On an old phone keypad, each digit from 2 to 9 maps to a few letters: 2 → `abc`, 3 → `def`, 4 → `ghi`, 5 → `jkl`, 6 → `mno`, 7 → `pqrs`, 8 → `tuv`, 9 → `wxyz`. Given a string `digits` made of those digits, return every string you could type by picking one letter for each digit, in order. Return them in any order. An empty `digits` string gives `[]`.

```js
function letterCombinations(digits) // → string[]
```

## Examples

```text
Input:  digits = "23"
Output: ["ad","ae","af","bd","be","bf","cd","ce","cf"]

Input:  digits = ""
Output: []

Input:  digits = "2"
Output: ["a","b","c"]
```

## Constraints

- 0 ≤ `digits.length` ≤ 4
- Each digit is between `'2'` and `'9'`

## Notes

- **Identify:** every string from choosing one letter per digit → backtracking over digit positions
- **Brute force:** iteratively build the cartesian product level by level, same O(4^n · n) with more copying
- **Insight:** each digit is one decision level; recurse through the digits, one letter at a time
- **Steps:** map digits to letters; dfs(i, path): at i = n save path; else for each letter of digits[i], recurse with it
- **Complexity:** O(4^n · n) time, O(n) recursion depth
- **Pitfall:** empty input returns [], not [""]
- **Related:** Generate Parentheses, Subsets, Permutations
