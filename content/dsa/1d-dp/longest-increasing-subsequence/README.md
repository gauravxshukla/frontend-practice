---
title: Longest Increasing Subsequence
type: dsa
difficulty: medium
topic: 1d-dp
order: 11
neetcode: true
tags: [dynamic-programming, binary-search, arrays]
estimatedMinutes: 25
---

Return the length of the longest **strictly increasing subsequence** of `nums`. A subsequence keeps the original order but may skip elements (it does not have to be contiguous).

```js
function lengthOfLIS(nums) // → number
```

## Examples

```text
Input:  nums = [10,9,2,5,3,7,101,18]
Output: 4
Explanation: One longest choice is [2, 3, 7, 101].

Input:  nums = [0,1,0,3,2,3]
Output: 4

Input:  nums = [7,7,7,7,7,7,7]
Output: 1
Explanation: Equal values are not strictly increasing.
```

## Constraints

- 1 ≤ `nums.length` ≤ 2500
- −10⁴ ≤ `nums[i]` ≤ 10⁴

## Notes

- **O(n²) DP:** let `lis(i)` be the longest increasing subsequence that **ends at** index `i`. Then `lis(i) = 1 + max(lis(j))` over `j < i` with `nums[j] < nums[i]` (or 1 if there is none). The answer is `max(lis(i))`. O(n²) time, O(n) space.
- **Optimal, patience sorting:** keep `tails[k]`, the smallest tail of any increasing subsequence of length `k + 1`. `tails` stays sorted, so for each `x` binary-search the first tail `≥ x` and overwrite it, or append if `x` is larger than all of them. The answer is `tails.length`. O(n log n) time, O(n) space.
- Why it works: a smaller tail can only help future elements extend the sequence, and replacing never shortens the best length found.
- `tails` is **not** itself a valid subsequence, only its length is meaningful.
- **Brute force:** check all 2ⁿ subsequences. O(2ⁿ · n).
- Pitfall: "strictly" increasing. Search for the first tail `≥ x` (lower bound). Using `> x` would let equal values extend the sequence.
- Edge cases: all equal → 1, strictly decreasing → 1, already sorted → n.
- Follow-up: reconstruct the subsequence (store the predecessor index for each position in `tails`).
- Follow-up: Russian Doll Envelopes reduces to LIS after sorting by width ascending and height descending.
