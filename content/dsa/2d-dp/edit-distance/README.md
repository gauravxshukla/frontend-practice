---
title: Edit Distance
type: dsa
difficulty: medium
topic: 2d-dp
order: 9
neetcode: true
tags: [dynamic-programming, strings]
estimatedMinutes: 30
---

Return the minimum number of single-character edits needed to turn `word1` into `word2`. One edit is **inserting** a character, **deleting** a character, or **replacing** one character with another.

```js
function minDistance(word1, word2) // → number
```

## Examples

```text
Input:  word1 = "horse", word2 = "ros"
Output: 3
Explanation: horse → rorse (replace h) → rose (delete r) → ros (delete e).

Input:  word1 = "intention", word2 = "execution"
Output: 5
```

## Constraints

- 0 ≤ `word1.length`, `word2.length` ≤ 500
- Both strings contain only lowercase English letters

## Notes

- **Key insight:** focus on the last characters of the two prefixes. If they match, they cost nothing. If not, the final edit was a delete, an insert or a replace, and each leaves a smaller prefix pair.
- **Recurrence:** `d(i, 0) = i`, `d(0, j) = j`; if `word1[i-1] === word2[j-1]` then `d(i, j) = d(i-1, j-1)`, else `d(i, j) = 1 + min(d(i-1, j) /* delete */, d(i, j-1) /* insert */, d(i-1, j-1) /* replace */)`.
- **2-D table:** O(m · n) time and space. The full table supports reconstructing the edit script.
- **Space optimisation:** each cell needs the one above, the one to the left, and the diagonal. One array plus a saved `diag` variable (the old value of `row[j - 1]` before it was overwritten) gives O(m · n) time and O(n) space.
- **Brute force:** plain recursion on the three choices. O(3^(m+n)) in the worst case. Memoising `(i, j)` turns it into the table above.
- Edge cases: either word empty → the other's length; identical words → 0.
- Pitfall: forgetting to reset `row[0] = i` at the start of each row, or reading `diag` after it has been overwritten.
- Pitfall: taking the match case as `1 + min(…)` with a 0-cost replace. It works, but the explicit match branch is clearer and faster.
- Follow-ups: weighted costs per operation, or "One Edit Distance" (decide `d ≤ 1` in O(n) without DP).
