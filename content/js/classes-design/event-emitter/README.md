---
title: Event Emitter
type: js
difficulty: medium
topic: classes-design
order: 1
tags: [classes, pub-sub, design]
estimatedMinutes: 25
---

Implement `class EventEmitter` (the default export), a small pub/sub hub like Node's `events` module.

- `on(name, listener)` registers `listener` for the event `name` and returns an **unsubscribe function**. Calling it removes exactly that registration; calling it again does nothing.
- `once(name, listener)` registers a listener that runs on the next `emit` of `name` only, then removes itself. Returns `this`.
- `off(name, listener)` removes **one** registration of `listener` (the most recently added one) and returns `this`. It also removes a listener that was added with `once`. Removing a listener that isn't registered is a no-op.
- `emit(name, ...args)` calls every listener for `name` in **registration order** with `args`, with `this` set to the emitter. It returns `true` if there were any listeners, otherwise `false`.
- `listenerCount(name)` returns how many registrations `name` has.
- The same function can be registered more than once; it is then called once per registration.

```js
const emitter = new EventEmitter();
const unsubscribe = emitter.on('greet', (name) => console.log(`hi ${name}`));

emitter.emit('greet', 'Ada'); // logs "hi Ada", returns true
unsubscribe();
emitter.emit('greet', 'Ada'); // logs nothing, returns false
```

**Constraints:** `emit` works on a **snapshot** of the listeners taken when it starts. A listener that adds or removes listeners (including itself) during an `emit` doesn't change which listeners that same `emit` calls; the change applies from the next `emit`. Instances are independent.

## Notes

- **Approach:** a `Map<name, Registration[]>` where each registration is a small object `{ listener, once }`. Storing objects (not bare functions) gives every registration its own identity, so `on`'s unsubscribe removes *its* entry even when the same function is registered twice.
- **Snapshot on emit:** iterate over `list.slice()`. Without the copy, a listener that removes itself shifts the array and the next listener is skipped; a listener that adds one can cause an infinite loop.
- **`once`:** remove the registration **before** calling the listener, so a listener that re-emits the same event doesn't run twice.
- **`off` with duplicates:** search from the end (`lastIndexOf`-style) and `splice` one entry, matching Node's behaviour.
- **Cleanup:** delete the map key when its list becomes empty, so `listenerCount` stays O(1) and long-lived emitters don't leak keys.
- **Complexity:** `on` O(1); `off`/unsubscribe O(k); `emit` O(k) for k listeners.
- **Follow-ups:**
  - **Errors:** should one throwing listener stop the rest? Node lets it propagate; a UI bus might catch and report instead.
  - **Wildcards / namespaces:** `'*'` listeners or `'user:*'`.
  - **Typed events:** a `Map<keyof Events, …>` in TypeScript.
  - **Memory-leak warning:** Node warns when a name exceeds `maxListeners`.
