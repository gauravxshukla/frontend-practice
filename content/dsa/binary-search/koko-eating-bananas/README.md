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

- **Key insight:** the hours needed, `Σ ceil(p / k)`, only goes down as `k` grows. That monotonic yes/no ("can I finish at speed k?") is what lets you binary search on the answer.
- The search range is `1 … max(piles)`. Any speed above the largest pile still takes one hour per pile.
- Find the first `k` where `hoursAt(k) <= h`: if it fits set `hi = mid`, otherwise `lo = mid + 1`, and stop when `lo === hi`.
- O(n · log(max pile)) time, O(1) space. Brute force tries every `k` from 1 upward, which is O(n · max pile) and far too slow for piles near 10⁹.
- Pitfall: integer division. Use `Math.ceil(p / k)` (or `Math.floor((p + k - 1) / k)`), not `p / k`.
- Pitfall: starting `lo` at 0 divides by zero.
- Edge cases: `h === piles.length` (answer is the max pile), one pile, huge `h` (answer is 1).
- Follow-up: the same "binary search on the answer" pattern solves capacity-to-ship-packages and split-array-largest-sum.
