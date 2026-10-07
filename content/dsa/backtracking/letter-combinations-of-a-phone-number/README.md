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

- **Key insight:** this is a Cartesian product. Each position independently picks one letter from its digit's group.
- **Backtracking:** `backtrack(i, prefix)` loops over the letters for `digits[i]` and recurses with `prefix + letter`. Record the prefix when `i === digits.length`. O(4ⁿ · n) time, O(n) depth.
- **Iterative:** start with `['']`, and for each digit replace the list with every existing string extended by each of its letters.
- Strings are immutable in JS, so `prefix + ch` needs no explicit "undo" step. With an array path you would push and pop.
- Pitfall: returning `['']` for empty input. The expected answer is `[]`.
- Pitfall: forgetting that 7 and 9 have **four** letters.
- Follow-up: T9-style lookup. Given a dictionary, return only the combinations that are real words (a trie prunes early).
