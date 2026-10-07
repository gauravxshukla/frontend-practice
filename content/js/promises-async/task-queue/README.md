---
title: Task Queue
type: js
difficulty: medium
topic: promises-async
order: 12
tags: [promises, async, concurrency, class]
estimatedMinutes: 25
---

Implement a `TaskQueue` class that runs async tasks with a concurrency limit.

```js
class TaskQueue {
  constructor(concurrency);
  add(task); // → Promise
  get pending(); // tasks waiting to start
  get running(); // tasks currently running
  onIdle(); // → Promise
}
```

- A **task** is a function that returns a promise (or a plain value). The queue calls it; `add` never runs it more than once.
- `add(task)` returns a promise that resolves or rejects with **that task's** result.
- At most `concurrency` tasks run at once. Waiting tasks start in **FIFO** order, as soon as a slot frees up.
- A failing task rejects only its own `add()` promise. The queue keeps going with the next task.
- `running` and `pending` update **synchronously**: right after `add()` returns, the task counts as running if a slot was free, otherwise as pending.
- `onIdle()` resolves once nothing is running or pending. If the queue is already idle, it resolves right away.
- Separate queues are independent.

```js
const queue = new TaskQueue(2);
const wait = (ms, value) => () => new Promise((r) => setTimeout(() => r(value), ms));

queue.add(wait(30, 'a')).then(console.log);
queue.add(wait(10, 'b')).then(console.log);
queue.add(wait(10, 'c')).then(console.log); // waits for 'b' to finish
queue.running; // 2
queue.pending; // 1
await queue.onIdle(); // logs b, c, a along the way
```

**Constraints:** `concurrency` is a positive integer. A task that throws synchronously counts as a failed task.

## Notes

- **Approach:** store `{ task, resolve, reject }` entries in an array. `add` pushes an entry and calls `#next()`, which, while `running < concurrency` and the queue is non-empty, shifts an entry, increments `running` and runs `Promise.resolve().then(task).then(resolve, reject).finally(done)`. `done` decrements `running`, calls `#next()` again and resolves any `onIdle` waiters if everything is finished.
- **Why `.then(task)`:** it turns a synchronous throw into a rejection, so one bad task can't break the queue.
- **Pitfall:** forgetting to call `#next()` in the failure path stalls the queue forever. Doing it in `finally` covers both.
- **Pitfall:** `Array#shift` is O(n). For huge queues, use a head index or a linked list.
- **Complexity:** O(1) bookkeeping per task (amortised).
- **Follow-ups:** priorities, `pause()`/`resume()`, `clear()` that rejects pending tasks, per-task timeouts, or a rate limit (N tasks per second).
