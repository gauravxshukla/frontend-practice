---
title: JSON.stringify
type: js
difficulty: hard
topic: polyfills
order: 15
tags: [polyfill, recursion, strings, objects]
estimatedMinutes: 40
---

Implement `jsonStringify(value)`, a standalone version of `JSON.stringify(value)` (no `replacer` or `space` arguments). Export it as `export default function jsonStringify(value)`. For every input in the rules below, its output must be **identical** to the native `JSON.stringify`.

```js
jsonStringify({ a: [1, 'x', null], b: true }); // '{"a":[1,"x",null],"b":true}'
jsonStringify('he said "hi"\n'); // '"he said \\"hi\\"\\n"'
jsonStringify({ skip: undefined, n: NaN }); // '{"n":null}'
jsonStringify(undefined); // undefined
```

**Primitives**
- `null` → `'null'`; booleans → `'true'` / `'false'`.
- Finite numbers → their `String(n)` form (`-0` → `'0'`). `NaN`, `Infinity` and `-Infinity` → `'null'`.
- Strings are wrapped in double quotes and escaped:
  - `"` → `\"` and `\` → `\\`;
  - `\b \f \n \r \t` use their short escapes;
  - any other control character (U+0000–U+001F) becomes `\u00XX` with lowercase hex (e.g. `'\u0001'` → `"\u0001"`);
  - everything else is left as-is.
- Boxed primitives (`new Number(1)`, `new String('a')`, `new Boolean(false)`) serialise like their primitive value.

**Objects and arrays**
- Arrays → `[` + elements joined by `,` + `]`. Holes, `undefined`, functions and symbols **inside arrays** become `null`.
- Plain objects → `{` + `"key":value` pairs joined by `,` + `}`, using own enumerable **string** keys in their normal order. Properties whose value is `undefined`, a function or a symbol are **omitted**. Symbol keys are ignored.
- No whitespace anywhere.

**Special cases**
- At the top level, `undefined`, a function or a symbol returns **`undefined`** (not a string).
- If a value (at any depth) is an object with a **`toJSON` method**, call `value.toJSON(key)` and serialise its result instead. `key` is the property name, the array index as a string, or `''` at the top level. This is how `Date` becomes an ISO string.
- A **BigInt** anywhere throws a `TypeError`.
- A **circular reference** throws a `TypeError`. The same object appearing twice in non-circular positions is fine.

## Notes

- **Approach:** one recursive `serialize(value, key)`.
  1. Apply `toJSON` if present.
  2. Unwrap boxed primitives.
  3. Switch on type: primitives return a string or `undefined`.
  4. Arrays map each index (`?? 'null'`); objects keep only the entries whose serialisation isn't `undefined`.
- **Circular detection:** keep a **stack** of the objects currently being serialised, not a set of everything seen. Push before recursing, pop after. A seen-set would wrongly reject `{ a: shared, b: shared }`.
- **Escaping:** one regex, `/["\\\u0000-\u001f]/g`, with a lookup table for the short escapes and `'\\u' + code.toString(16).padStart(4, '0')` for the rest.
- **Pitfalls:**
  - `typeof null === 'object'`;
  - `undefined` in arrays must become `null` while in objects it's dropped;
  - `NaN` must not print as `NaN`;
  - holes read as `undefined`, so iterate by index, not `forEach`;
  - `toJSON` runs before the type check, so it can return a primitive.
- **Complexity:** O(total size of the output); stack depth equals the nesting depth.
- **Follow-ups:** the `replacer` (function or allow-list array) and `space` (indentation) arguments; well-formed output for lone surrogates (`'\ud800'` → `"\\ud800"`); `Map`/`Set` (serialise as `{}`); and writing the matching `JSON.parse`.
