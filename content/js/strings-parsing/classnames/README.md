---
title: classNames
type: js
difficulty: medium
topic: strings-parsing
order: 2
tags: [strings, recursion, react]
estimatedMinutes: 15
---

Implement `classNames(...args)`, a utility for building a `className` string from mixed inputs (like the popular `classnames`/`clsx` libraries).

- **Strings and numbers** are added as-is.
- **Plain objects:** each key whose value is truthy is added.
- **Arrays** are flattened recursively, so their items follow the same rules at any depth.
- **Falsy values** (`null`, `undefined`, `false`, `0`, `''`, `NaN`) are ignored.
- **Everything else** is ignored too: `true`, functions, and non-plain objects such as `Date`, `Map` or class instances.

The result is every collected class name in argument order, joined with a single space.

```js
classNames('foo', 'bar'); // 'foo bar'
classNames('foo', { bar: true, baz: false }); // 'foo bar'
classNames({ 'foo-bar': true }, null, ['qux', ['quux', { corge: 1 }]]); // 'foo-bar qux quux corge'
classNames('a', 0, undefined, 1, false, 'b'); // 'a 1 b'
classNames(); // ''
```

**Constraints:** don't remove duplicates or trim strings; just skip the values the rules above ignore.

## Notes

- **Approach:** collect into one array with a recursive helper: string or number → push; array → recurse into each item; plain object → push each key with a truthy value; anything else → skip. Finish with `classes.join(' ')`.
- **Plain object check:** `Object.getPrototypeOf(value) === Object.prototype` (or `null` for `Object.create(null)`). A plain `typeof value === 'object'` check would treat `Date` or `Map` as an object of flags.
- **Why skip `true`:** `cond && 'cls'` evaluates to `false` (skipped), but `cond || 'cls'` could give `true`, which isn't a class name.
- **Pitfall:** `0` is a number but falsy, so it's ignored. Check falsiness before type.
- **Complexity:** O(total input size).
- **Follow-ups:** a `dedupe` variant (later objects can turn earlier classes off), `clsx`'s smaller API, or a version that respects an object's custom `toString`.
