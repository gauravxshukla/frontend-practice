---
title: Partition Labels
type: dsa
difficulty: medium
topic: greedy
order: 7
neetcode: true
tags: [strings, greedy, hash-map, two-pointers]
estimatedMinutes: 20
---

You get a string `s` of lowercase letters. Cut it into as many pieces as possible so that every letter appears in **at most one** piece. The pieces, joined back together in order, must give `s`.

Return an array with the **length** of each piece, in order.

```js
function partitionLabels(s) // → number[]
```

## Examples

```text
Input:  s = "ababcbacadefegdehijhklij"
Output: [9,7,8]
Explanation: Pieces "ababcbaca", "defegde", "hijhklij". Each letter lives in one piece.

Input:  s = "eccbbbbdec"
Output: [10]
```

## Constraints

- 1 ≤ `s.length` ≤ 500
- `s` contains only lowercase English letters

## Notes

- **Key insight:** once a piece contains a letter, it must stretch at least to that letter's **last** occurrence.
- First pass: record `last[c]`, the final index of each letter.
- Second pass: keep `end = max(end, last[s[i]])`. When `i === end`, every letter seen so far is finished, so close the piece and push `end − start + 1`.
- O(n) time, O(1) extra space (26 letters).
- Brute force: test every cut position by comparing the letter sets on each side, O(n²) or O(26·n) with prefix counts.
- Pitfall: returning the pieces themselves instead of their lengths.
- Pitfall: closing a piece as soon as the *current* letter ends, while an earlier letter in the same piece still appears later.
- Follow-up: the related "merge intervals" view, where each letter is the interval [first, last] and the pieces are the merged intervals.
