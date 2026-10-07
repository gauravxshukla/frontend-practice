---
title: isEmpty
type: js
difficulty: medium
topic: objects-utilities
order: 9
tags: [objects, types, lodash]
estimatedMinutes: 15
---

Implement `isEmpty(value)` with lodash's semantics. It returns `true` when `value` is an "empty" collection and `false` otherwise.

- **`null` / `undefined`:** `true`.
- **Strings, arrays and array-like objects:** empty when `length` is `0`. An object is array-like if it isn't a function and has a `length` that is a non-negative integer (e.g. `arguments`, typed arrays, `{ length: 0 }`).
- **`Map` / `Set`:** empty when `size` is `0`.
- **Other objects** (plain objects, class instances, `Object.create(null)`): empty when they have no **own enumerable string keys**. Inherited and symbol keys don't count.
- **Numbers, booleans, bigints and symbols:** always `true`, because they aren't collections. (Yes, `isEmpty(42)` is `true`.)

```js
isEmpty(null); // true
isEmpty(''); // true
isEmpty([1]); // false
isEmpty({}); // true
isEmpty({ a: undefined }); // false (the key exists)
isEmpty(new Map([['k', 1]])); // false
isEmpty(0); // true
```

**Constraints:** a sparse array like `new Array(3)` has length 3, so it is **not** empty.

## Notes

- **Approach:** order the checks: `value == null` → array-like (`length`) → `Map`/`Set` (`size`) → non-objects return `true` → `Object.keys(value).length === 0`.
- **Why `Object.keys` and not `for…in`:** `for…in` walks inherited enumerable keys. You'd need a `hasOwnProperty` guard, and `Object.create(null)` has no `hasOwnProperty` to call.
- **Pitfalls:** `!value.length` alone says `isEmpty(0)` is `false` and crashes on `null`; `JSON.stringify(v) === '{}'` is slow, ignores `Map`/`Set`, and calls `{ a: undefined }` empty.
- **Complexity:** O(k) for objects (building the key list); you can bail out early with `for…in` + `Object.hasOwn` to make it O(1).
- **Follow-ups:** why lodash treats numbers as empty (it's a *collection* check), deep emptiness (`{ a: {} }`), and what a TypeScript signature for this should narrow.
