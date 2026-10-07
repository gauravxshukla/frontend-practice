# JavaScript Output: Event Loop Ordering

Predict the exact order of the logs. Every snippet sticks to browser-portable APIs (`setTimeout`, `Promise`, `queueMicrotask`, `async`/`await`) and assumes an ES module, so top-level code runs as one synchronous task. The rule of thumb: the current synchronous task runs to completion, then the microtask queue is drained completely (including microtasks queued along the way), and only then does the next macrotask, such as a timer, get a turn.

---

## 1. Interleaved registration

```js
setTimeout(() => console.log('T1'), 0);
Promise.resolve().then(() => console.log('P1'));
console.log('S1');
setTimeout(() => console.log('T2'), 0);
Promise.resolve().then(() => console.log('P2'));
console.log('S2');
```

**Output**

```
S1
S2
P1
P2
T1
T2
```

**Why**

- Where a line sits in the source matters only within its own queue.
- Synchronous logs run first, then the whole microtask queue in FIFO order, then timers in the order they were scheduled.

**Variant:** Change the second timer's delay to `-1`. Negative delays are clamped to 0, so nothing changes.

---

## 2. Timer inside `.then`, promise inside a timer

```js
Promise.resolve().then(() => {
  console.log('then 1');
  setTimeout(() => console.log('timeout from then'), 0);
});
setTimeout(() => {
  console.log('timeout 1');
  Promise.resolve().then(() => console.log('then from timeout'));
}, 0);
console.log('sync');
```

**Output**

```
sync
then 1
timeout 1
then from timeout
timeout from then
```

**Why**

- `then 1` is a microtask, so it runs before any timer and schedules its own timer.
- That timer is scheduled after `timeout 1`, and both have a 0ms delay, so it fires second.
- After each timer callback, the microtask queue is drained, so `then from timeout` runs right after `timeout 1`.

**Variant:** Give the outer `setTimeout` a 10ms delay and predict again.

---

## 3. Microtasks that queue microtasks

```js
setTimeout(() => console.log('timer'), 0);
function chain(n) {
  if (n === 0) return;
  queueMicrotask(() => {
    console.log('micro', n);
    chain(n - 1);
  });
}
chain(3);
console.log('sync');
```

**Output**

```
sync
micro 3
micro 2
micro 1
timer
```

**Why**

- The microtask queue is drained until it is empty, including jobs added while it is draining.
- The timer has to wait for the whole chain, however long it is.

**Variant:** Replace `queueMicrotask` with `setTimeout(…, 0)` and see where `timer` ends up.

---

## 4. `queueMicrotask` vs `.then`

```js
Promise.resolve().then(() => console.log('then A'));
queueMicrotask(() => console.log('qm B'));
Promise.resolve().then(() => console.log('then C'));
queueMicrotask(() => console.log('qm D'));
```

**Output**

```
then A
qm B
then C
qm D
```

**Why**

- Promise reactions and `queueMicrotask` callbacks share one microtask queue.
- Neither has priority over the other: they run strictly in the order they were queued.

**Variant:** Attach `.then` to a promise that is still pending, then resolve it from a `queueMicrotask`.

---

## 5. An async body runs synchronously

```js
function compute() {
  console.log('compute');
  return 42;
}
async function load() {
  console.log('load: start');
  const x = compute();
  console.log('load: got', x);
  await undefined;
  console.log('load: resumed');
}
console.log('before');
load();
console.log('after');
```

**Output**

```
before
load: start
compute
load: got 42
after
load: resumed
```

**Why**

- Calling an `async` function runs its body synchronously, like any other call.
- Only the first `await` suspends it and gives control back to the caller.
- Everything after the `await` resumes in a microtask.

**Variant:** Remove the `await`. `load: resumed` now prints before `after`.

---

## 6. Awaiting a plain value

```js
async function f() {
  console.log('f1');
  await 5;
  console.log('f2');
}
f();
Promise.resolve()
  .then(() => console.log('p1'))
  .then(() => console.log('p2'));
console.log('sync');
```

**Output**

```
f1
sync
f2
p1
p2
```

**Why**

- `await 5` wraps the value in a resolved promise, but it still suspends for one microtask.
- `f`'s continuation is queued before `p1` because `f()` ran first.

**Variant:** Swap the `f()` call and the promise chain.

---

## 7. Two awaits vs a `.then` chain

```js
async function a() {
  console.log('a1');
  await null;
  console.log('a2');
  await null;
  console.log('a3');
}
a();
Promise.resolve()
  .then(() => console.log('t1'))
  .then(() => console.log('t2'))
  .then(() => console.log('t3'));
```

**Output**

```
a1
a2
t1
a3
t2
t3
```

**Why**

- Each `await` of a non-promise costs one microtask, just like each `.then` step.
- The two sequences take turns: one step from `a`, then one from the chain.

**Variant:** Change the first `await null` to `await new Promise(r => setTimeout(r))`.

---

## 8. Awaiting another async function

```js
async function inner() {
  console.log('inner');
  return 'v';
}
async function outer() {
  const v = await inner();
  console.log('outer got', v);
}
outer();
Promise.resolve()
  .then(() => console.log('t1'))
  .then(() => console.log('t2'));
console.log('sync');
```

**Output**

```
inner
sync
outer got v
t1
t2
```

**Why**

- `inner()` runs synchronously and returns a promise that is already fulfilled.
- Awaiting a native promise that has already settled costs just one microtask, so `outer` resumes before `t1`.

**Variant:** Make `inner` return `Promise.resolve('v')` and count the extra ticks.

---

## 9. A microtask flood blocks timers

```js
let count = 0;
setTimeout(() => console.log('timer sees count =', count), 0);
function flood() {
  count++;
  if (count < 100000) queueMicrotask(flood);
}
flood();
console.log('sync done, count =', count);
```

**Output**

```
sync done, count = 1
timer sees count = 100000
```

**Why**

- Every microtask queues the next one, so the queue never empties until the counter stops it.
- Timers, rendering and input all wait until the microtask queue drains. An unbounded loop like this would freeze the page.

**Variant:** Re-queue `flood` with `setTimeout` instead. The timer then sees `count = 1`, because it was already waiting in the timer queue.

---

## 10. Where can `try`/`catch` see an error?

```js
function run(label, fn) {
  try {
    fn();
    console.log(label, 'returned normally');
  } catch (e) {
    console.log(label, 'caught', e.message);
  }
}
run('sync', () => { throw new Error('A'); });
run('promise', () => {
  Promise.reject(new Error('B')).catch((e) => console.log('B handled by .catch'));
});
run('timer', () => {
  setTimeout(() => {
    try { throw new Error('C'); } catch { console.log('C caught inside the timer'); }
  }, 0);
});
```

**Output**

```
sync caught A
promise returned normally
timer returned normally
B handled by .catch
C caught inside the timer
```

**Why**

- A `try` only covers code that runs while it is on the stack.
- A rejection is a value. It only reaches a `.catch` (or an `await` inside a `try`).
- A timer callback runs in a later task, on a fresh stack, so the outer `try` finished long before it.

**Variant:** Make `fn` an `async` function and `await` it inside the `try`.

---

## 11. Big puzzle: mixed queues

```js
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve()
  .then(() => {
    console.log('3');
    setTimeout(() => console.log('4'), 0);
  })
  .then(() => console.log('5'));
queueMicrotask(() => console.log('6'));
(async () => {
  console.log('7');
  await null;
  console.log('8');
})();
console.log('9');
```

**Output**

```
1
7
9
3
6
8
5
2
4
```

**Why**

- Sync: `1`, the async IIFE body up to `await` (`7`), then `9`.
- Initial microtasks in order: `3`, `6`, `8`. Running `3` queues `5` at the back.
- Timers: `2` was scheduled during the sync phase, `4` during a microtask.

**Variant:** Replace `await null` with `await new Promise(r => setTimeout(r, 0))`.

---

## 12. Timer delays and nesting

```js
setTimeout(() => console.log('A 50ms'), 50);
setTimeout(() => {
  console.log('B 0ms');
  setTimeout(() => console.log('C nested 0ms'), 0);
}, 0);
setTimeout(() => console.log('D 0ms'), 0);
```

**Output**

```
B 0ms
D 0ms
C nested 0ms
A 50ms
```

**Why**

- Timers fire in order of due time, with ties broken by scheduling order.
- `C` is only scheduled once `B` runs, so it lands behind `D`, which was already waiting.
- A delay is a minimum, not a guarantee.

**Variant:** Change `A`'s delay to 0.

---

## 13. Pending vs already-resolved promise

```js
let resolveLater;
const pending = new Promise((r) => { resolveLater = r; });
pending.then(() => console.log('pending resolved'));
Promise.resolve().then(() => console.log('already resolved'));
setTimeout(() => {
  console.log('timer');
  resolveLater();
}, 0);
console.log('sync');
```

**Output**

```
sync
already resolved
timer
pending resolved
```

**Why**

- `.then` on a pending promise only stores the handler. Nothing is queued until the promise settles.
- Resolving inside the timer queues the handler, and it runs in the microtask checkpoint right after that timer.

**Variant:** Call `resolveLater()` synchronously right after the `setTimeout` line.

---

## 14. `await` inside a loop

```js
async function loop() {
  for (let i = 0; i < 3; i++) {
    console.log('loop', i);
    await null;
  }
}
loop();
Promise.resolve()
  .then(() => console.log('x'))
  .then(() => console.log('y'));
console.log('sync');
```

**Output**

```
loop 0
sync
loop 1
x
loop 2
y
```

**Why**

- Each iteration suspends once, and a resume costs one microtask.
- The loop and the `.then` chain alternate one step at a time.

**Variant:** Move the `await` above the `console.log` in the loop body.

---

## 15. Two async functions side by side

```js
async function a() {
  console.log('a1');
  await null;
  console.log('a2');
  await null;
  console.log('a3');
}
async function b() {
  console.log('b1');
  await null;
  console.log('b2');
}
a();
b();
console.log('end');
```

**Output**

```
a1
b1
end
a2
b2
a3
```

**Why**

- Both bodies run synchronously until their first `await`.
- Each resume queues the next step at the back of the microtask queue, so the two functions take turns.

**Variant:** Call `await a()` inside `b` before `b1` and trace it again.

---

## 16. Awaiting a timer-based sleep

```js
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function main() {
  console.log('main start');
  await sleep(0);
  console.log('main after sleep');
}
main();
setTimeout(() => console.log('timer'), 0);
Promise.resolve().then(() => console.log('micro'));
console.log('sync');
```

**Output**

```
main start
sync
micro
main after sleep
timer
```

**Why**

- `sleep`'s timer is scheduled before `timer` because `main()` runs first.
- When it fires, it resolves the promise, and `main` resumes in the microtask checkpoint right after that timer, before the next timer runs.

**Variant:** Swap the `main()` call and the `setTimeout` line.

---

## 17. Big puzzle: await on an async call

```js
async function first() {
  console.log('A');
  await second();
  console.log('B');
}
async function second() {
  console.log('C');
}
console.log('D');
setTimeout(() => console.log('E'), 0);
first();
new Promise((resolve) => {
  console.log('F');
  resolve();
})
  .then(() => console.log('G'))
  .then(() => console.log('H'));
console.log('I');
```

**Output**

```
D
A
C
F
I
B
G
H
E
```

**Why**

- `second()` runs synchronously inside `first` (prints `C`). The promise executor runs synchronously too (prints `F`).
- `first` resumes one microtask after the await, so it is queued ahead of `G`.
- The timer runs last.

**Variant:** Make `second` `return new Promise(r => r())` without `async`.

---

## 18. Big puzzle: nested queues

```js
setTimeout(() => console.log('t1'), 0);
queueMicrotask(() => {
  console.log('m1');
  queueMicrotask(() => console.log('m2'));
  setTimeout(() => console.log('t2'), 0);
});
(async () => {
  console.log('a1');
  await Promise.resolve();
  console.log('a2');
  setTimeout(() => console.log('t3'), 0);
})();
Promise.resolve().then(() => console.log('p1'));
console.log('s');
```

**Output**

```
a1
s
m1
a2
p1
m2
t1
t2
t3
```

**Why**

- Microtasks queued during the sync phase: `m1`, the async resume, then `p1`.
- `m2` is queued while `m1` runs, so it goes to the back, behind `p1`.
- Timers run in scheduling order: `t1` (sync), `t2` (from `m1`), `t3` (from the async resume).

**Variant:** Change `await Promise.resolve()` to `await new Promise(r => r(Promise.resolve()))`.

---
