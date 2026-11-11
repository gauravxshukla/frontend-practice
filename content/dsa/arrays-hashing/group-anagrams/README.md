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

- **Identify:** bucket words that are anagrams of each other → hash map keyed by a letter signature
- **Brute force:** compare every pair with an anagram check, O(n²·k)
- **Better:** key each word by its sorted letters, O(n·k log k)
- **Insight:** instead of sorting each word, key it by its 26 letter counts
- **Steps:** for each word, count letters, join the counts into a key, append the word to that key's group
- **Complexity:** O(n²·k) → O(n·k) time, O(n·k) space
- **Pitfall:** join counts with a separator, or counts like 1,11 and 11,1 produce the same key
- **Related:** Valid Anagram, Top K Frequent Elements, Encode and Decode Strings
