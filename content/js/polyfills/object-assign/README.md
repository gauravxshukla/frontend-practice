---
title: Object.assign
type: js
difficulty: easy
topic: polyfills
order: 13
tags: [polyfill, objects]
estimatedMinutes: 15
---

Implement `objectAssign(target, ...sources)`, a standalone version of `Object.assign`. Export it as `export default function objectAssign(target, ...sources)`.

```js
const target = { a: 1 };
const result = objectAssign(target, { b: 2 }, { a: 3, c: 4 });
result; // { a: 3, b: 2, c: 4 }
result === target; // true
```

- Copy every **own, enumerable** property of each source onto `target`, then **return `target`** (the same object, mutated).
- Copy both **string keys and symbol keys**.
- Sources are applied left to right, so **later sources win** on conflicting keys.
- **Skip `null` and `undefined` sources** silently.
- **Getters on a source are invoked**: the target receives the getter's current value as a plain data property, not the getter itself.
- Assignment uses normal `target[key] = value`, so setters on the target run.

**Constraints:**
- Throw a `TypeError` if `target` is `null` or `undefined`.
- Ignore inherited and non-enumerable properties.
- A string source contributes its characters as index keys (`objectAssign({}, 'hi')` → `{ 0: 'h', 1: 'i' }`).
- It's a **shallow** copy: nested objects are shared by reference.

## Notes

- **Approach:** `const to = Object(target)`. For each non-null source, `const from = Object(source)`, then loop `Reflect.ownKeys(from)` and copy the keys whose `Object.getOwnPropertyDescriptor(from, key).enumerable` is true, with `to[key] = from[key]`.
- **Why `Reflect.ownKeys`:** `Object.keys` and `for...in` miss symbol keys, and `for...in` also walks the prototype chain.
- **Getters vs. descriptors:** `to[key] = from[key]` reads through the getter, which matches the spec. To copy accessors as accessors, use `Object.defineProperties(to, Object.getOwnPropertyDescriptors(from))`, a common follow-up.
- **Pitfalls:** checking `if (!source)` (skips `0`/`''` sources, which is harmless but shows imprecision), and forgetting that it returns the original target, not a copy.
- **Complexity:** O(total number of source keys).
- **Follow-ups:** deep merge, and why `{ ...a, ...b }` differs (it defines properties, so target setters don't run).
