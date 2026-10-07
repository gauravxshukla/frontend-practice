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

- **Key insight:** a delimiter alone always breaks, because the delimiter itself can appear in the data. Instead, *prefix each string with its length*.
- **Encode:** for each string, append `length + '#' + string`. `["ab","#c"]` becomes `"2#ab2##c"`.
- **Decode:** at position `i`, read digits up to the next `#` to get the length `L`, take the next `L` characters, and continue from there. The `#` inside a string is never examined as a separator because you skip over it by length.
- O(total characters) time for both, with O(1) extra space beyond the output.
- Pitfall: an empty list and a list with one empty string must encode differently (`""` vs `"0#"`).
- Pitfall: `String.length` counts UTF-16 code units. That's fine as long as encode and decode both use `length` and `slice`.
- Alternative: escape the delimiter (e.g. `/` becomes `//` and the separator is `/:`). It works but is easier to get wrong.
- Follow-up: a fixed-width binary length header (4 bytes) avoids scanning for `#` and is how many network protocols frame messages.
