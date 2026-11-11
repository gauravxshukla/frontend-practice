---
title: Koko Eating Bananas
type: dsa
difficulty: medium
topic: binary-search
order: 3
neetcode: true
tags: [arrays, binary-search, binary-search-on-answer]
estimatedMinutes: 20
---

There are `piles` of bananas, where `piles[i]` is the size of pile `i`, and you have `h` hours. You pick one integer speed `k` (bananas per hour). Each hour you choose a single pile and eat up to `k` bananas from it. If the pile has fewer than `k` left you finish it and wait out the rest of that hour; you never move to a second pile in the same hour.

Return the **smallest** `k` that lets you finish every pile within `h` hours. It's guaranteed that `h ≥ piles.length`, so an answer always exists.

```js
function minEatingSpeed(piles, h) // → number
```

## Examples

```text
Input:  piles = [3,6,7,11], h = 8
Output: 4
Explanation: at k = 4 the piles take 1 + 2 + 2 + 3 = 8 hours. At k = 3 they take 10.

Input:  piles = [30,11,23,4,20], h = 5
Output: 30
Explanation: one pile per hour, so k must be at least the biggest pile.

Input:  piles = [30,11,23,4,20], h = 6
Output: 23
```

## Constraints

- 1 ≤ `piles.length` ≤ 10⁴
- `piles.length` ≤ `h` ≤ 10⁹
- 1 ≤ `piles[i]` ≤ 10⁹

## Notes

- **Identify:** "minimum speed that still finishes in h hours" → binary search on the answer
- **Key formula:** hours at speed k = Σ ceil(pile / k)
- **Brute force:** try every speed from 1 up to max(piles), O(max · n)
- **Insight:** hours only fall as speed rises, so binary search the smallest speed that fits in h
- **Steps:** l = 1, r = max pile; if hours(mid) ≤ h keep mid as a candidate and go left, else go right
- **Complexity:** O(max · n) → O(n log max) time, O(1) space
- **Pitfall:** total hours can exceed 32 bits with huge piles; use a long (Java) for the sum
- **Related:** Binary Search, Find Minimum in Rotated Sorted Array, Search a 2D Matrix
