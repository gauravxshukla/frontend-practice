---
title: Type Utilities
type: js
difficulty: easy
topic: objects-utilities
order: 8
tags: [types, typeof, objects]
estimatedMinutes: 10
---

`typeof` is famously unhelpful: `typeof null`, `typeof []` and `typeof new Date()` are all `'object'`. Implement `getType(value)` (the default export), which returns a precise, **lowercase** type name.

| Value | Result |
| --- | --- |
| `null` / `undefined` | `'null'` / `'undefined'` |
| booleans, numbers (incl. `NaN`, `Infinity`), strings, bigints, symbols | `'boolean'`, `'number'`, `'string'`, `'bigint'`, `'symbol'` |
| any function: regular, arrow, `async`, generator, class | `'function'` |
| arrays | `'array'` |
| `Date`, `RegExp`, `Map`, `Set` instances | `'date'`, `'regexp'`, `'map'`, `'set'` |
| everything else: plain objects, class instances, `Object.create(null)` | `'object'` |

```js
getType(null); // 'null'
getType([1, 2]); // 'array'
getType(new Date()); // 'date'
getType(async () => {}); // 'function'
getType(new (class Foo {})()); // 'object'
```

**Constraints:** only the 14 names in the table are ever returned. An object created with `Object.create(null)` has no prototype and must not crash your function.

## Notes

- **Approach:** handle `null` first, then anything whose `typeof` isn't `'object'` (this covers every primitive and every function). For objects, check `Array.isArray` and `instanceof Date/RegExp/Map/Set`, and fall back to `'object'`.
- **The `Object.prototype.toString.call(v)` trick:** it returns `'[object Date]'`, `'[object Null]'` and so on, and works across realms (iframes). But async and generator functions come back as `'[object AsyncFunction]'`/`'[object GeneratorFunction]'`, and objects with `Symbol.toStringTag` can report anything. So you still need a whitelist.
- **Pitfalls:** `typeof null === 'object'`; `value.constructor.name` crashes on `Object.create(null)` and is fooled by class instances; `instanceof Array` fails across realms (prefer `Array.isArray`).
- **Follow-ups:** `isPlainObject` (prototype is `Object.prototype` or `null`), boxed primitives (`new Number(1)`), typed arrays, and narrowing these checks into TypeScript type guards.
