---
title: String Compression
type: js
difficulty: medium
topic: strings-parsing
order: 4
tags: [strings, parsing, run-length-encoding]
estimatedMinutes: 15
---

Implement run-length encoding. Export **one default object** with two methods: `{ encode, decode }`.

- `encode(str)` replaces each run of the same character with the character followed by the run length. A run of length 1 is written as just the character (no `1`).
- `decode(str)` reverses `encode`. A character not followed by a number appears once. A count can have several digits.
- Both return `''` for `''`.

```js
import rle from './solution.js';

rle.encode('aaabccdddd'); // 'a3bc2d4'
rle.encode('abc'); // 'abc'
rle.encode('aaaaaaaaaaaa'); // 'a12'
rle.decode('a3bc2d4'); // 'aaabccdddd'
rle.decode('a12'); // 'aaaaaaaaaaaa'
```

**Constraints:**

- The input to `encode` never contains digits, but may contain any other characters (spaces, punctuation, upper/lower case, which are distinct).
- For any such string `s`, `decode(encode(s)) === s`.
- Runs are only consecutive characters: `'aba'` encodes to `'aba'`.

## Notes

- **Encode:** walk the string, tracking the current character and count. When the character changes (or the string ends), append `char + (count > 1 ? count : '')`. Build an array and `join('')` rather than concatenating in a loop if the input can be large.
- **Decode:** a regex does it neatly: `str.replace(/(\D)(\d*)/g, (_, ch, n) => ch.repeat(n ? Number(n) : 1))`. Or scan manually: read a character, then read all following digits as one number.
- **Pitfall:** reading only one digit after a character breaks counts like `12`.
- **Pitfall:** forgetting to flush the final run in `encode`.
- **Why the "no digits" rule:** if the input could contain digits, `'a3'` would be ambiguous. Real formats fix this with escaping or by always writing the count (`a1b1`).
- **Complexity:** O(n) for encode, O(output length) for decode.
- **Follow-ups:** LeetCode-style in-place compression of a char array, only returning the encoded form when it's shorter, or a byte-level RLE for binary data.
