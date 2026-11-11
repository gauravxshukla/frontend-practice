---
title: Merge Triplets to Form Target Triplet
type: dsa
difficulty: medium
topic: greedy
order: 6
neetcode: true
tags: [arrays, greedy]
estimatedMinutes: 15
---

You get a list of `triplets`, each `[a, b, c]`, and a `target` triplet `[x, y, z]`.

You may repeatedly pick two triplets `i` and `j` and replace triplet `j` with their element-wise maximum: `[max(a_i, a_j), max(b_i, b_j), max(c_i, c_j)]`. Return `true` if, after any number of these operations, `target` can appear as one of the triplets. Otherwise return `false`.

```js
function mergeTriplets(triplets, target) // → boolean
```

## Examples

```text
Input:  triplets = [[2,5,3],[1,8,4],[1,7,5]], target = [2,7,5]
Output: true
Explanation: Merge [2,5,3] with [1,7,5] to get [2,7,5]. [1,8,4] is skipped because 8 > 7.

Input:  triplets = [[3,4,5],[4,5,6]], target = [3,2,5]
Output: false
Explanation: No triplet has 2 in the middle, and the max can never go down.
```

## Constraints

- 1 ≤ `triplets.length` ≤ 10⁵
- `triplets[i].length === target.length === 3`
- 1 ≤ every value ≤ 1000

## Notes

- **Identify:** merging takes the element-wise max → keep only triplets that never exceed the target
- **Brute force:** try every subset of triplets and merge it, O(2^n)
- **Insight:** a triplet with any value above the target poisons the merge; every other triplet is safe to include
- **Steps:** for each triplet with all values ≤ target, mark each position where it equals the target; need all 3 marked
- **Complexity:** O(2^n) → O(n) time, O(1) space
- **Pitfall:** a triplet that hits one target value but overshoots another must be skipped entirely
- **Related:** Partition Labels, Gas Station, Hand of Straights
