---
title: Function.prototype.bind
type: js
difficulty: medium
topic: polyfills
order: 12
tags: [polyfill, functions, this, prototypes]
estimatedMinutes: 25
---

Implement `Function.prototype.myBind`, a polyfill for `Function.prototype.bind`. Export it as `export default function myBind(thisArg, ...boundArgs)`. It's attached to the prototype, so `this` is the target function:

```js
Function.prototype.myBind = myBind;
function greet(greeting, punct) {
  return `${greeting}, ${this.name}${punct}`;
}
const hiAda = greet.myBind({ name: 'Ada' }, 'Hi');
hiAda('!'); // 'Hi, Ada!'
hiAda('?'); // 'Hi, Ada?'
```

- Return a **new function**. Calling it calls the target with `this` fixed to `thisArg` and the arguments `[...boundArgs, ...callArgs]` (bound args first). Return the target's result.
- The bound function can be called **any number of times**; each call is independent.
- **Called with `new`**, the bound function ignores `thisArg` and constructs a fresh instance of the target, passing the combined arguments:
  - `new Bound(...)` must be `instanceof` the target, and the target's prototype methods must be available on it;
  - if the target constructor returns an object, `new` returns that object.
- **Rule: don't use the native `bind`, `call` or `apply`** anywhere in your solution. Use `Reflect.apply` / `Reflect.construct`, or the Symbol-key trick from `myCall`.

**Constraints:** throw a `TypeError` if `this` isn't a function. Binding a `class` must work with `new`.

## Notes

- **Approach:** capture `target = this`. Return `function bound(...args) { ... }`. Inside, check `new.target`: when it's set, return `Reflect.construct(target, allArgs, new.target)`; otherwise return `Reflect.apply(target, thisArg, allArgs)`.
- **Prototype linkage:** set `bound.prototype = Object.create(target.prototype)` (when the target has one; arrow functions don't). Then `new bound()` inherits from `target.prototype`, so `instanceof` works both for the target and for `bound`.
- **Why `Reflect.construct` over `target.apply(this, args)`:** the older `this instanceof bound` pattern can't construct `class` targets (classes throw when called without `new`) and gets confused when someone `myCall`s the bound function with an instance as `this`.
- **Pitfalls:** an arrow function for `bound` (it can't be `new`ed, and it has no `new.target`), forgetting to prepend the bound args, and putting `boundArgs` after the call args.
- **Follow-ups:** native bound functions have `name` `'bound greet'` and `length = max(0, target.length - boundArgs.length)`; set them with `Object.defineProperty`. Binding twice keeps the first `this`.
