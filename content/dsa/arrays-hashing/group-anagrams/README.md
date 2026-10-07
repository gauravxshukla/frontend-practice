---
title: Group Anagrams
type: dsa
difficulty: medium
topic: arrays-hashing
order: 4
neetcode: true
tags: [strings, hash-map, sorting, counting]
estimatedMinutes: 20
---

You get an array of lowercase words, `strs`. Put words that are anagrams of each other (same letters, same counts, any order) into the same group, and return the list of groups.

The groups can come back in any order, and so can the words inside each group.

```js
function groupAnagrams(strs) // → string[][]
```

## Examples

```text
Input:  strs = ["eat","tea","tan","ate","nat","bat"]
Output: [["eat","tea","ate"],["tan","nat"],["bat"]]

Input:  strs = [""]
Output: [[""]]

Input:  strs = ["a"]
Output: [["a"]]
```

## Constraints

- 1 ≤ `strs.length` ≤ 10⁴
- 0 ≤ `strs[i].length` ≤ 100
- Words contain only lowercase English letters.

## Notes

- **Key insight:** every word needs a *signature* that is identical for all of its anagrams. Then it's a single hash-map grouping pass.
- **Sorted signature:** `[...w].sort().join('')`. O(n · m log m) for n words of length m. Easy to write and usually acceptable.
- **Count signature (optimal):** build a 26-slot count array and join it with a separator, e.g. `"1,0,0,…"`. O(n · m) time, O(n · m) space for the map.
- Pitfall: joining counts *without* a separator is ambiguous. Counts `[1,11]` and `[11,1]` both become `"111"`.
- Pitfall: the empty string is a valid word and forms its own group (or groups with other empty strings).
- **Baseline:** compare every pair of words with an anagram check, which is O(n² · m) and too slow for 10⁴ words.
- Follow-up: if the alphabet were all of Unicode, use a sorted signature or a `Map` of counts serialized in a stable order.
