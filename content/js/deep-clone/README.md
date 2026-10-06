---
title: Deep Clone
type: js
difficulty: medium
tags: [objects, recursion, lodash]
estimatedMinutes: 15
---

Implement `deepClone(value)`. It returns a deep copy of a JSON-like value, so no nested object or array is shared with the original.

You only need to handle primitives, `null`, plain objects and arrays.

```js
const obj = { user: { roles: ['admin'] } };
const copy = deepClone(obj);
copy.user.roles.push('editor');
obj.user.roles; // ['admin']
```

## Notes

- **Classic bug:** `typeof null === 'object'`. Check `value === null` explicitly. (The original version had `typeof value === null`, which is never true, so `deepClone(null)` crashed in `Object.entries(null)`.)
- Arrays first (`Array.isArray`), then objects via `Object.fromEntries(Object.entries(v).map(...))`.
- Follow-ups: circular references (track seen objects in a `WeakMap`), `Date`/`Map`/`Set`/`RegExp`, symbol keys, and keeping prototypes. `structuredClone` handles most of these natively, but not functions or class prototypes.
