---
title: Function.prototype.call
type: js
difficulty: easy
topic: polyfills
order: 10
tags: [polyfill, functions, this]
estimatedMinutes: 15
---

Implement `Function.prototype.myCall`, a polyfill for `Function.prototype.call`. Export it as `export default function myCall(thisArg, ...args)`. It's attached to the prototype, so `this` is the function being called:

```js
Function.prototype.myCall = myCall;
function greet(greeting, punct) {
  return `${greeting}, ${this.name}${punct}`;
}
greet.myCall({ name: 'Ada' }, 'Hello', '!'); // 'Hello, Ada!'
```

- Invoke the function with `this` set to `thisArg` and the remaining arguments passed through. Return whatever it returns.
- **Don't use the native `call`, `apply` or `bind`.** The classic trick: temporarily store the function as a method on `thisArg` and call it as `thisArg[key](...args)`.
- Use a **`Symbol`** as that temporary key, so you can never overwrite an existing property, and **delete it afterwards**, even if the function throws.
- If `thisArg` is `null` or `undefined`, use `globalThis`.
- If `thisArg` is a primitive (number, string, boolean), box it with `Object(thisArg)` so a property can be attached.

**Constraints:** after the call, `thisArg` must have exactly the same own keys (including symbols) as before. Throw a `TypeError` if `this` isn't a function.

## Notes

- **Approach:** `const ctx = thisArg == null ? globalThis : Object(thisArg); const key = Symbol(); ctx[key] = this; try { return ctx[key](...args); } finally { delete ctx[key]; }`
- **Why a Symbol:** a string key like `'fn'` could clobber, or be shadowed by, a real property, and it shows up in `Object.keys` if the function inspects its `this`.
- **Why `try/finally`:** if the function throws, the temporary key would otherwise leak onto the object.
- **Differences from native:** in strict mode, native `call` passes `null`/primitives through untouched. This polyfill uses the sloppy-mode rules (globalThis, boxing), as most interviewers expect. It also can't attach a key to a frozen or non-extensible object; `Reflect.apply(fn, thisArg, args)` avoids that, but is usually off-limits in this question.
- **Follow-ups:** `apply` (same, with an array of args) and `bind` (returns a function, must handle `new`).
