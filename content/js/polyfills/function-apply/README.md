---
title: Function.prototype.apply
type: js
difficulty: easy
topic: polyfills
order: 11
tags: [polyfill, functions, this]
estimatedMinutes: 15
---

Implement `Function.prototype.myApply`, a polyfill for `Function.prototype.apply`. Export it as `export default function myApply(thisArg, argsArray)`. It's attached to the prototype, so `this` is the function being called:

```js
Function.prototype.myApply = myApply;
function greet(greeting, punct) {
  return `${greeting}, ${this.name}${punct}`;
}
greet.myApply({ name: 'Ada' }, ['Hello', '!']); // 'Hello, Ada!'
Math.max.myApply(null, [3, 9, 4]); // 9
```

- Invoke the function with `this` set to `thisArg` and the elements of `argsArray` as its arguments. Return whatever it returns.
- `argsArray` may be **`null` or `undefined`**: call with no arguments.
- `argsArray` may be any **array-like** (an object with `length` and indexed elements, such as `arguments`).
- **Don't use the native `call`, `apply` or `bind`.** Temporarily store the function on `thisArg` under a **`Symbol`** key, call it as a method, and **delete the key afterwards**, even if the function throws.
- `null`/`undefined` `thisArg` → `globalThis`; primitive `thisArg` → box it with `Object(thisArg)`.

**Constraints:** throw a `TypeError` if `argsArray` is a primitive other than `null`/`undefined` (e.g. a number or string). After the call, `thisArg` has the same own keys as before.

## Notes

- **Approach:** normalise the arguments with `argsArray == null ? [] : Array.from(argsArray)`, then do exactly what `myCall` does: `ctx[key](...args)` inside `try/finally`.
- **Why reject primitives:** native `apply` requires an object (`CreateListFromArrayLike`). `Array.from('ab')` would quietly turn a string into `['a', 'b']`.
- **Pitfalls:** spreading `argsArray` directly (`...argsArray` fails on non-iterable array-likes like `{ length: 2, 0: 'a', 1: 'b' }`), and forgetting `null`.
- **Follow-up:** before spread syntax, polyfills built the call with `eval('ctx[key](' + argNames + ')')`. Mention it, but don't write it.
