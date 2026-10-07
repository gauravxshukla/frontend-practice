---
title: Deep Clone
type: js
difficulty: medium
topic: objects-utilities
order: 18
tags: [objects, recursion, lodash]
estimatedMinutes: 15
---

Implement `deepClone(value)`. It returns a deep copy of a JSON-like value, so no nested object or array is shared with the original.

- **Primitives** (`number`, `string`, `boolean`), `null` and `undefined` are returned as they are.
- **Arrays** are copied into new arrays, and each item is cloned.
- **Plain objects** are copied into new plain objects with the same own enumerable keys, in the same order, and each value is cloned. Keys whose value is `undefined` or `null` are kept.
- Every object and array in the result is a **new** instance, including empty ones. An object that appears twice in the input must not be shared with the original in either place.
- Do not mutate the input.

```js
const obj = { user: { roles: ['admin'] } };
const copy = deepClone(obj);
copy.user.roles.push('editor');
obj.user.roles; // ['admin']

deepClone({ a: undefined, b: [[1]] }); // { a: undefined, b: [[1]] }
```

**Constraints:** you only need to handle primitives, `null`, `undefined`, plain objects and arrays. Inputs have no circular references, `Date`s, `Map`s, functions or class instances.

## Notes

- **Approach:** primitives and `null` first (`value === null || typeof value !== 'object'` → return it). Then `Array.isArray(value)` → `value.map(deepClone)`. Otherwise `Object.fromEntries(Object.entries(value).map(([k, v]) => [k, deepClone(v)]))`.
- **Pitfalls:** `typeof null === 'object'`, so check `null` explicitly. (The original version had `typeof value === null`, which is never true, so `deepClone(null)` crashed in `Object.entries(null)`.) Check arrays before objects, or arrays come back as `{ 0: …, 1: … }`. `{ ...obj }` and `Object.assign` are only one level deep. `JSON.parse(JSON.stringify(x))` drops `undefined` values and throws on cycles.
- **Complexity:** O(n) time and space in the total number of values, plus O(depth) call stack.
- **Follow-ups:** circular references (a `WeakMap` from original to clone, which also preserves shared references), `Date`/`Map`/`Set`/`RegExp`, symbol keys, keeping prototypes, and how `structuredClone` compares (it handles most of these, but not functions or class prototypes).
