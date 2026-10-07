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

- **Key insight:** max never decreases. Any triplet with some value *above* the target in that position poisons whatever it touches, so it can never be used.
- Every other triplet is safe to merge in, since it can only raise values up to (never past) the target.
- So: skip triplets where any `t[k] > target[k]`. Among the rest, record which positions hit `target[k]` exactly. Return `true` if all three positions get hit.
- O(n) time, O(1) space.
- Brute force: try every subset of triplets and take its element-wise max, O(2ⁿ).
- Pitfall: checking each position independently across *all* triplets, including bad ones. A triplet like `[1,8,4]` matches nothing useful when 8 exceeds the target.
- Pitfall: requiring a single triplet to match the whole target. The three positions can come from different triplets.
- Follow-up: return the indices of a set of triplets that forms the target.
