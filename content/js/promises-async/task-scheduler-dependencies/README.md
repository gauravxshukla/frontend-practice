---
title: Task Scheduler with Dependencies
type: js
difficulty: hard
topic: promises-async
order: 15
tags: [promises, async, graphs, topological-sort]
estimatedMinutes: 35
---

Implement `runTasks(tasks)`. `tasks` maps a task id to its dependencies and an async `run` function:

```js
{ [id]: { deps: string[], run: () => Promise<any> } }
```

- Start a task as soon as **all** of its `deps` have resolved. A task with no deps starts immediately.
- Tasks that don't depend on each other run **in parallel**, not one after another.
- Call each `run` **exactly once**, even if many tasks depend on it.
- Resolve with an object mapping every id to its task's result: `{ [id]: result }`.
- If any task rejects, the whole run rejects with that error. Tasks that depend on the failed task must not start.
- Validate the graph **before running anything**:
  - a dep that isn't a key of `tasks` rejects with an `Error` whose message contains `'Unknown dependency'`;
  - a cycle (including a task depending on itself) rejects with an `Error` whose message contains `'cycle'`.
- Always return a promise; never throw synchronously.

```js
const results = await runTasks({
  config: { deps: [], run: () => loadConfig() },
  db: { deps: ['config'], run: () => connectDb() },
  cache: { deps: ['config'], run: () => connectCache() }, // runs in parallel with db
  server: { deps: ['db', 'cache'], run: () => startServer() },
});
// { config: ..., db: ..., cache: ..., server: ... }

await runTasks({ a: { deps: ['b'], run }, b: { deps: ['a'], run } }); // rejects: 'Dependency cycle detected: a -> b -> a'
```

**Constraints:** ids are strings. An empty `tasks` object resolves to `{}`.

## Notes

- **Approach (promise memoisation):** after validation, define `start(id)`, which returns a cached promise `Promise.all(deps.map(start)).then(() => run())`. Calling `start` for every id and awaiting them all gives maximal parallelism: each task waits only on its own deps, and the cache guarantees one `run` per task.
- **Cycle detection:** DFS with three states (unvisited, visiting, done). Reaching a "visiting" node means a back edge, i.e. a cycle. Keep the current path to print it. Without this check, memoised `start` on a cycle deadlocks or recurses forever.
- **Alternative:** Kahn's algorithm. Track in-degrees, start every zero-in-degree task, and on each completion decrement its dependents. If the processed count is less than n, there is a cycle.
- **Failure:** a failed dep rejects the `Promise.all` inside its dependents, so they never call `run`. The top-level `Promise.all` rejects with the first error.
- **Complexity:** O(V + E) to validate and schedule. Wall time equals the longest (critical) path.
- **Follow-ups:** pass dependency results into `run`, a concurrency limit, cancelling still-running tasks on failure (`AbortSignal`), or reporting partial results.
