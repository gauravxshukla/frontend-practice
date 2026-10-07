---
title: String.prototype.repeat
type: js
difficulty: easy
topic: polyfills
order: 14
tags: [polyfill, strings, this]
estimatedMinutes: 10
---

Implement `String.prototype.myRepeat`, a polyfill for `String.prototype.repeat`. Export it as `export default function myRepeat(count)`. It's attached to the prototype, so `this` is the string:

```js
String.prototype.myRepeat = myRepeat;
'ab'.myRepeat(3); // 'ababab'
'ab'.myRepeat(0); // ''
'ab'.myRepeat(-1); // throws RangeError
```

- Return a new string made of `count` copies of the string.
- Convert `count` to a number and drop any fractional part (`2.9` → `2`, `'2'` → `2`, `NaN`/`undefined` → `0`).
- A count of `0` returns `''`.

**Constraints:**
- Throw a `RangeError` if the count is negative or `Infinity`. (A fraction between -1 and 0, like `-0.5`, truncates to `0` and returns `''`.)
- Repeating an empty string returns `''` for any valid count.

## Notes

- **Simple approach:** loop `count` times appending the string. O(count) concatenations. Fine for interviews, and modern engines make `+=` cheap (ropes).
- **O(log n) doubling:** like fast exponentiation. While `n > 0`: if `n` is odd, append the current chunk to the result; halve `n` (`Math.floor(n / 2)`); double the chunk (`chunk += chunk`). `'ab'.repeat(5)` builds `ab`, `abab`, `abababab` and picks the 1s in binary 101.
- **Validation order:** convert and truncate first, then check `n < 0 || n === Infinity`. Checking `count < 0` before truncating would wrongly throw for `-0.5`.
- **Pitfall:** using `n & 1` / `n >> 1` for doubling breaks above 2^31. Use `%` and `Math.floor`.
- **Follow-up:** `padStart`/`padEnd` are built on the same idea.
