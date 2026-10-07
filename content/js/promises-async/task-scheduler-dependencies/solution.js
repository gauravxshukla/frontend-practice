function validate(tasks) {
  const ids = Object.keys(tasks);
  for (const id of ids) {
    for (const dep of tasks[id].deps) {
      if (!Object.hasOwn(tasks, dep)) throw new Error(`Unknown dependency "${dep}" in task "${id}"`);
    }
  }

  const state = {}; // undefined = unvisited, 1 = visiting, 2 = done
  const path = [];
  const visit = (id) => {
    if (state[id] === 2) return;
    if (state[id] === 1) {
      const loop = [...path.slice(path.indexOf(id)), id];
      throw new Error(`Dependency cycle detected: ${loop.join(' -> ')}`);
    }
    state[id] = 1;
    path.push(id);
    tasks[id].deps.forEach(visit);
    path.pop();
    state[id] = 2;
  };
  ids.forEach(visit);
}

/**
 * @param {Record<string, { deps: string[], run: () => Promise<any> }>} tasks
 * @return {Promise<Record<string, any>>}
 */
export default async function runTasks(tasks) {
  validate(tasks);

  // One cached promise per task: it waits for its own deps only, then runs once.
  const started = new Map();
  const start = (id) => {
    if (!started.has(id)) {
      const { deps, run } = tasks[id];
      started.set(id, Promise.all(deps.map(start)).then(() => run()));
    }
    return started.get(id);
  };

  const ids = Object.keys(tasks);
  const results = await Promise.all(ids.map(start));
  return Object.fromEntries(ids.map((id, i) => [id, results[i]]));
}
