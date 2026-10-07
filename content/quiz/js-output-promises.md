# JavaScript Output: Promises, Chaining and Errors

Predict what each chain logs, and in what order. These cards are about how values and errors flow through `.then`, `.catch` and `.finally`, how the `Promise` combinators settle, and how `async`/`return await` change both the result and the timing. Snippets assume an ES module, so top-level `await` is allowed.

---

## 1. The executor runs synchronously

```js
console.log('a');
const p = new Promise((resolve) => {
  console.log('b');
  resolve('c');
  console.log('d');
});
p.then((v) => console.log(v));
console.log('e');
```

**Output**

```
a
b
d
e
c
```

**Why**

- The executor function is called immediately, inside the `new Promise` call.
- `resolve` doesn't return or stop the executor. It only settles the promise.
- `.then` handlers always run later as microtasks, even if the promise has already settled.

**Variant:** Put `throw new Error('x')` after `resolve('c')`. The promise still fulfils with `'c'`.

---

## 2. Settling twice

```js
const p = new Promise((resolve, reject) => {
  resolve('first');
  resolve('second');
  reject(new Error('third'));
  console.log('executor keeps running');
});
p.then(
  (v) => console.log('value:', v),
  (e) => console.log('error:', e.message),
);
```

**Output**

```
executor keeps running
value: first
```

**Why**

- A promise settles only once. Any later `resolve` or `reject` call is silently ignored.
- The rest of the executor still runs, since `resolve` and `reject` are ordinary function calls.

**Variant:** Call `reject` first and `resolve` second.

---

## 3. Forgetting to return a promise

```js
const wait = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));
Promise.resolve()
  .then(() => { wait(20, 'A'); })
  .then((v) => console.log('1st chain got', v));
Promise.resolve()
  .then(() => wait(20, 'B'))
  .then((v) => console.log('2nd chain got', v));
```

**Output**

```
1st chain got undefined
2nd chain got B
```

**Why**

- In the block body there's no `return`, so the step fulfils with `undefined` straight away and the timer runs detached from the chain.
- Returning the promise makes the next step wait for it and receive its value.

**Variant:** Make `wait` reject. The first chain never sees the error.

---

## 4. A throw skips to the next catch

```js
Promise.resolve(1)
  .then((v) => { throw new Error('bad ' + v); })
  .then(() => console.log('skipped'))
  .catch((e) => {
    console.log('caught', e.message);
    return 'recovered';
  })
  .then((v) => console.log('then after catch:', v));
```

**Output**

```
caught bad 1
then after catch: recovered
```

**Why**

- A throw inside a handler rejects the promise that `.then` returned.
- Rejections pass through `.then` calls that have no rejection handler.
- A `.catch` that returns a value fulfils its promise, so the chain carries on as a success.

**Variant:** Remove the `return` from the catch. The last log shows `undefined`.

---

## 5. Throwing inside `catch`

```js
Promise.reject(new Error('one'))
  .catch((e) => {
    console.log('catch 1:', e.message);
    throw new Error('two');
  })
  .then(() => console.log('not reached'))
  .catch((e) => console.log('catch 2:', e.message))
  .then((v) => console.log('end:', v));
```

**Output**

```
catch 1: one
catch 2: two
end: undefined
```

**Why**

- `.catch` is just `.then(undefined, handler)`, so a throw inside it rejects the next promise.
- The second catch handles that error and returns `undefined`, which fulfils the chain.

**Variant:** Return `Promise.reject(new Error('two'))` instead of throwing it.

---

## 6. Two-argument `.then`

```js
Promise.resolve('ok')
  .then(
    (v) => { throw new Error('from success handler'); },
    (e) => console.log('sibling handler:', e.message),
  )
  .catch((e) => console.log('next catch:', e.message));
```

**Output**

```
next catch: from success handler
```

**Why**

- The two handlers of one `.then` are alternatives: each watches the previous promise, never the other handler.
- An error thrown by the success handler can only be caught further down the chain.

**Variant:** Start from `Promise.reject(new Error('early'))`.

---

## 7. `finally` passes values through

```js
Promise.resolve('value')
  .finally(() => {
    console.log('finally 1');
    return 'ignored';
  })
  .then((v) => console.log('then:', v));
Promise.reject(new Error('err'))
  .finally(() => console.log('finally 2'))
  .catch((e) => console.log('catch:', e.message));
```

**Output**

```
finally 1
finally 2
then: value
catch: err
```

**Why**

- The `finally` callback receives no arguments, and a normal return value is ignored.
- The original fulfilment value or rejection reason passes through unchanged.

**Variant:** Return `Promise.resolve('ignored too')` from the first `finally`.

---

## 8. `finally` that throws or rejects

```js
Promise.resolve('value')
  .finally(() => { throw new Error('thrown in finally'); })
  .then((v) => console.log('then:', v))
  .catch((e) => console.log('catch A:', e.message));
Promise.reject(new Error('original'))
  .finally(() => Promise.reject(new Error('replaced')))
  .catch((e) => console.log('catch B:', e.message));
```

**Output**

```
catch A: thrown in finally
catch B: replaced
```

**Why**

- A `finally` can't change a success into a different value, but it can turn the outcome into a failure.
- A throw, or a returned promise that rejects, replaces the original result, whether that was a value or an error.

**Variant:** Have the second `finally` return `new Promise(r => setTimeout(r, 50))`. It delays the chain without changing the result.

---

## 9. Resolving with a thenable

```js
const thenable = {
  then(onFulfilled) {
    console.log('then() called');
    onFulfilled('from thenable');
  },
};
Promise.resolve(thenable).then((v) => console.log(v));
console.log('sync');
```

**Output**

```
sync
then() called
from thenable
```

**Why**

- Any object with a `then` method is treated as promise-like, and its value is adopted.
- The spec calls `thenable.then` in a separate microtask, never synchronously, so `sync` prints first.

**Variant:** Have `then` call `onFulfilled` twice with different values.

---

## 10. `Promise.resolve(p)` vs `new Promise(r => r(p))`

```js
const p = Promise.resolve('p');
const a = Promise.resolve(p);
const b = new Promise((r) => r(p));
console.log(a === p, b === p);
b.then(() => console.log('b'));
a.then(() => console.log('a'));
```

**Output**

```
true false
a
b
```

**Why**

- `Promise.resolve` returns a native promise unchanged, so `a` is `p` and is already fulfilled.
- Resolving a new promise with another promise takes two extra microtasks: one to call `p.then`, and one for that callback to run.
- `b` is registered first but settles later.

**Variant:** Wrap `p` in three nested `new Promise(r => r(…))` calls and count the ticks.

---

## 11. `Promise.all` fails fast, but nothing is cancelled

```js
const delay = (ms, label, fail) =>
  new Promise((res, rej) =>
    setTimeout(() => {
      console.log('settled', label);
      fail ? rej(new Error(label)) : res(label);
    }, ms));
Promise.all([delay(30, 'slow'), delay(10, 'fails', true), delay(20, 'medium')])
  .then((v) => console.log('all:', v))
  .catch((e) => console.log('all rejected with', e.message));
```

**Output**

```
settled fails
all rejected with fails
settled medium
settled slow
```

**Why**

- `Promise.all` rejects as soon as any input rejects.
- Promises can't be cancelled, so the other timers still fire and their work still happens. Their results are just dropped.

**Variant:** Switch to `Promise.allSettled` and log the result array.

---

## 12. `allSettled` result shapes

```js
const results = await Promise.allSettled([
  Promise.resolve(1),
  Promise.reject(new Error('nope')),
  42,
]);
for (const r of results) {
  console.log(r.status, 'value' in r ? r.value : r.reason.message);
}
console.log(Object.keys(results[0]).join(), Object.keys(results[1]).join());
```

**Output**

```
fulfilled 1
rejected nope
fulfilled 42
status,value status,reason
```

**Why**

- `allSettled` never rejects. Each slot is `{ status, value }` or `{ status, reason }`.
- Plain values like `42` are wrapped with `Promise.resolve` and count as fulfilled.
- Results keep the input order, not the order the promises settled in.

**Variant:** Pass an empty array. You get `[]` right away.

---

## 13. `race` with already-settled inputs

```js
const slow = new Promise((r) => setTimeout(() => r('slow'), 0));
const done = Promise.resolve('already done');
const failed = Promise.reject(new Error('already failed'));
const report = (p) => p.then(
  (v) => console.log('race:', v),
  (e) => console.log('race error:', e.message),
);
report(Promise.race([slow, failed, done]));
report(Promise.race([slow, done, failed]));
```

**Output**

```
race error: already failed
race: already done
```

**Why**

- When more than one input has already settled, the one that comes first in the array wins, because `race` subscribes to the inputs in order.
- An earlier rejection beats a later fulfilment, and the reverse is also true.

**Variant:** Pass `[]` to `Promise.race`. It stays pending forever.

---

## 14. `Promise.any` when everything fails

```js
try {
  await Promise.any([
    Promise.reject(new Error('a')),
    Promise.reject(new TypeError('b')),
  ]);
} catch (e) {
  console.log(e.constructor.name, e.message);
  console.log(e.errors.map((x) => x.message).join());
}
```

**Output**

```
AggregateError All promises were rejected
a,b
```

**Why**

- `any` fulfils with the first success. It rejects only when every input rejects.
- The rejection is an `AggregateError`, and its `errors` array is in input order.

**Variant:** Add `Promise.resolve('c')` at the end of the array.

---

## 15. Async functions never throw synchronously

```js
async function boom() {
  throw new Error('async boom');
}
let result;
try {
  result = boom();
  console.log('no throw, got', result instanceof Promise);
} catch (e) {
  console.log('caught synchronously');
}
result.catch((e) => console.log('rejected with', e.message));
```

**Output**

```
no throw, got true
rejected with async boom
```

**Why**

- An `async` function always returns a promise. A throw anywhere in its body, even before any `await`, becomes a rejection.
- A `try` around the call only catches the error if you `await` the call.

**Variant:** Remove `async` and predict again.

---

## 16. Un-awaited return inside `try`

```js
const fail = () => Promise.reject(new Error('fail'));
async function withoutAwait() {
  try { return fail(); } catch { return 'handled (no await)'; }
}
async function withAwait() {
  try { return await fail(); } catch { return 'handled (await)'; }
}
const show = (v) => console.log(v);
withoutAwait().then(show, (e) => console.log('escaped:', e.message));
withAwait().then(show, (e) => console.log('escaped:', e.message));
```

**Output**

```
handled (await)
escaped: fail
```

**Why**

- `return fail()` returns a promise without waiting for it, so the `try` block ends before the rejection happens.
- `return await fail()` waits inside the `try`, and the rejection is thrown there and caught.
- The escaped rejection also takes extra ticks to reach the caller, which is why it logs second.

**Variant:** Wrap both bodies in `try`/`finally` and log inside `finally`.

---

## 17. `return await` vs `return` timing

```js
async function plain() {
  return Promise.resolve('plain');
}
async function awaited() {
  return await Promise.resolve('awaited');
}
plain().then((v) => console.log(v));
awaited().then((v) => console.log(v));
Promise.resolve().then(() => console.log('tick 1'))
  .then(() => console.log('tick 2'))
  .then(() => console.log('tick 3'));
```

**Output**

```
tick 1
awaited
tick 2
plain
tick 3
```

**Why**

- `awaited` resumes after one tick, returns a plain string, and its caller's `.then` runs on tick 2.
- `plain` resolves its promise with a promise, which costs two extra ticks, so its `.then` runs on tick 3.
- Outside a `try`, both forms produce the same result. Only the timing differs.

**Variant:** Return a non-promise value from `plain`.

---

## 18. Non-function handlers are ignored

```js
Promise.resolve('kept')
  .then(42)
  .then(null)
  .then(console.log('logged immediately'))
  .then((v) => console.log('value:', v));
```

**Output**

```
logged immediately
value: kept
```

**Why**

- If a handler isn't a function, `.then` passes the value through unchanged.
- `console.log(...)` is evaluated synchronously while the chain is being built, and its `undefined` return value becomes the "handler".

**Variant:** Start from `Promise.reject('lost?')` and end with `.catch(console.log)`.

---

## 19. `Promise.all` keeps input order

```js
const slowFirst = new Promise((r) => setTimeout(() => r('slow'), 20));
const fast = Promise.resolve('fast');
const values = await Promise.all([slowFirst, 'plain', fast]);
console.log(values.join(' | '));
const empty = await Promise.all([]);
console.log(empty.length);
```

**Output**

```
slow | plain | fast
0
```

**Why**

- The results follow the order of the inputs, not the order in which they finished.
- Non-promise values are passed through as already fulfilled.
- An empty input fulfils immediately with `[]`.

**Variant:** Make `fast` reject and wrap the `await` in `try`/`catch`.

---
