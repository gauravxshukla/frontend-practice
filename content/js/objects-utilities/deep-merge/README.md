---
title: Deep Merge
type: js
difficulty: medium
topic: objects-utilities
order: 20
tags: [objects, recursion, security]
estimatedMinutes: 20
---

Implement `deepMerge(target, source)`. It merges two plain objects into a **new** object, where `source` wins on conflicts.

- **Both values are plain objects:** they are merged recursively.
- **Both values are arrays:** they are **concatenated** (`target`'s items first, then `source`'s).
- **Any other conflict:** `source`'s value overwrites `target`'s. That includes primitives, `null`, an array against an object, and non-plain objects such as `Date`.
- **`undefined` in `source`** never overwrites. A key whose `source` value is `undefined` keeps `target`'s value.
- **Keys present in only one input** are copied over.
- **Inputs are not mutated, and nothing is shared:** neither input is changed, and every plain object and array in the result is a **new** copy. Primitives and non-plain objects are copied by reference.
- **Prototype pollution:** an own `__proto__` key (for example from `JSON.parse`) must be ignored. It must never change `Object.prototype` or the result's prototype.

```js
deepMerge({ a: 1, b: { x: 1, y: [1] } }, { b: { y: [2], z: 3 }, c: 4 });
// { a: 1, b: { x: 1, y: [1, 2], z: 3 }, c: 4 }

deepMerge({ a: 1 }, { a: undefined }); // { a: 1 }
deepMerge({ a: { b: 1 } }, { a: null }); // { a: null }

deepMerge({}, JSON.parse('{"__proto__": {"polluted": true}}'));
({}).polluted; // undefined
```

**Constraints:** after `const r = deepMerge(t, s)`, mutating anything inside `r` must not affect `t` or `s`.

## Notes

- **Approach:** a `merge(a, b)` helper:
  - `b === undefined` → `clone(a)`;
  - both arrays → `[...a, ...b].map(clone)`;
  - both plain objects → start from a clone of `a` and, for each own key of `b`, set `out[k] = merge(a[k], b[k])`;
  - otherwise → `clone(b)`.
  - `clone` is the same recursion for one side (arrays and plain objects copied, everything else returned as is).
- **Prototype pollution:** `out['__proto__'] = …` invokes the inherited `__proto__` setter and changes `out`'s prototype. A naive recursive merge that reads `target['__proto__']` gets `Object.prototype` and writes into it, which affects every object in the program. Skip `__proto__` (and arguably `constructor`/`prototype`), or build with `Object.create(null)` / `Object.defineProperty`.
- **Pitfalls:** spreading (`{ ...a, ...b }`) is only one level deep. `Object.assign(target, …)` mutates. Overwriting with `undefined` loses defaults (the classic "merge config with options" bug).
- **Complexity:** O(total size of both inputs).
- **Follow-ups:** variadic `deepMerge(...objects)`, a custom array strategy (replace, merge by index, or unique), circular references, and how `structuredClone` or lodash's `merge` (which mutates its first argument) differ.
