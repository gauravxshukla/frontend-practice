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

- **Identify:** split a string so each letter is in one part, as many parts as possible → last-occurrence greedy
- **Brute force:** for each cut, check that no letter appears on both sides, O(n²)
- **Insight:** a part must extend to the last occurrence of every letter inside it; close it when i reaches that end
- **Steps:** record each letter's last index; scan, end = max(end, last[ch]); when i == end, cut and start a new part
- **Complexity:** O(n²) → O(n) time, O(26) space
- **Pitfall:** the end can grow while scanning, so cut only when i reaches the current end
- **Related:** Merge Intervals, Hand of Straights, Merge Triplets to Form Target Triplet
