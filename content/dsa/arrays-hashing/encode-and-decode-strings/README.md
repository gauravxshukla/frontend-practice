---
title: Encode and Decode Strings
type: dsa
difficulty: medium
topic: arrays-hashing
order: 6
neetcode: true
tags: [strings, design, serialization]
estimatedMinutes: 20
---

Write two functions. `encode` turns a list of strings into **one** string, and `decode` turns that string back into the original list. The grader runs `decode(encode(strs))` and expects exactly `strs` back.

The strings can contain **any** characters, including digits, `#`, spaces, newlines, and non-ASCII text, and some of them may be empty. So no single character is safe to use as a plain separator.

```js
function encode(strs)    // → string
function decode(encoded) // → string[]
export default { encode, decode };
```

## Examples

```text
Input:  strs = ["neet","code","love","you"]
Output: ["neet","code","love","you"]

Input:  strs = ["we","say",":","yes"]
Output: ["we","say",":","yes"]
```

(The output is the result of `decode(encode(strs))`. Your encoded format is up to you.)

## Constraints

- 0 ≤ `strs.length` ≤ 100
- 0 ≤ `strs[i].length` ≤ 200
- Strings may contain any character.

## Notes

- **Identify:** list of strings ↔ one string, any character allowed → length-prefix encoding
- **Brute force:** join with a delimiter; breaks as soon as a string contains that delimiter
- **Insight:** instead of a delimiter, prefix each string with its length and `#`, then read exactly that many chars
- **Steps:** encode each as `len#str`; decode by reading digits up to `#`, then slicing len characters
- **Complexity:** O(n) → O(n) time and space, n = total characters; the fix is correctness, not speed
- **Pitfall:** `[]` and `[""]` must differ: they encode to "" and "0#"
- **Related:** Serialize and Deserialize Binary Tree, Group Anagrams
