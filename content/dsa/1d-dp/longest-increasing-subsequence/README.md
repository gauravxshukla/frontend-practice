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

- **Identify:** longest strictly increasing subsequence → patience sorting: binary search on tail values
- **Brute force:** try all 2^n subsequences, O(2^n · n)
- **Better:** dp[i] = 1 + max dp[j] for j < i with nums[j] < nums[i], O(n²)
- **Insight:** keep tails[k] = smallest possible tail of an increasing run of length k + 1; it stays sorted
- **Steps:** for each num, binary search the first tail ≥ num; replace it, or append if none; answer is tails' length
- **Complexity:** O(2^n · n) → O(n log n) time, O(n) space
- **Pitfall:** tails isn't an actual subsequence, only its length is meaningful; use ≥ for strictly increasing
- **Related:** Longest Common Subsequence, Longest Increasing Path in a Matrix, Binary Search
