---
title: promisify
type: js
difficulty: medium
topic: promises-async
order: 7
tags: [promises, async, callbacks, this]
estimatedMinutes: 15
---

Implement `promisify(fn)`. `fn` takes a Node-style callback as its **last** argument: `callback(err, value)`. Return a function that takes the same arguments (without the callback) and returns a promise instead.

- Call `fn` with the given arguments followed by your own callback appended at the end.
- Forward `this`, so `obj.method = promisify(obj.method)` keeps working.
- If the callback receives a truthy `err`, reject with it. Otherwise resolve with `value`.
- If `fn` throws synchronously, the returned promise rejects with that error (the wrapper itself must not throw).
- Only the **first** callback invocation counts; later ones are ignored.
- Each call of the wrapper calls `fn` again.

```js
function readConfig(name, callback) {
  setTimeout(() => (name ? callback(null, { name }) : callback(new Error('no name'))), 10);
}

const readConfigAsync = promisify(readConfig);
await readConfigAsync('app'); // { name: 'app' }
await readConfigAsync(''); // rejects with Error('no name')
```

**Constraints:** the callback is always the last argument passed to `fn`, after however many arguments the caller gave. A `null` or `undefined` error means success.

## Notes

- **Approach:** return a regular `function (...args)` that builds `new Promise((resolve, reject) => fn.call(this, ...args, callback))`.
- **Free behaviour from the Promise constructor:** a synchronous throw inside the executor becomes a rejection, and a promise can only settle once, so extra callback calls are ignored with no flag.
- **`this`:** an arrow function for the *wrapper* would lose the caller's `this`. Inside, an arrow executor is fine, because it captures the wrapper's `this`.
- **Pitfall:** some callbacks pass several values (`callback(err, a, b)`). Node's `util.promisify` only keeps the first unless the function defines `util.promisify.custom`.
- **Complexity:** O(1) overhead per call.
- **Follow-ups:** support `fn[promisify.custom]`, write the reverse (`callbackify`), or promisify every method of an object (`promisifyAll`).
