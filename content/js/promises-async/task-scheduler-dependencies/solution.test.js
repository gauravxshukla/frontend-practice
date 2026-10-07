import runTasks from './solution.js';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function catchError(promise) {
  try {
    await promise;
  } catch (e) {
    return e;
  }
  throw new Error('expected the promise to reject');
}

describe('runTasks', () => {
  test('example: runs a dependency graph and resolves with every result', async () => {
    const results = await runTasks({
      config: { deps: [], run: async () => 'cfg' },
      db: { deps: ['config'], run: async () => 'db' },
      cache: { deps: ['config'], run: async () => 'cache' },
      server: { deps: ['db', 'cache'], run: async () => 'server' },
    });
    expect(results).toEqual({ config: 'cfg', db: 'db', cache: 'cache', server: 'server' });
  });

  test('example: a cycle rejects with an error mentioning "cycle"', async () => {
    const run = jest.fn(async () => 1);
    await expect(runTasks({ a: { deps: ['b'], run }, b: { deps: ['a'], run } })).rejects.toThrow('cycle');
  });

  test('a task starts only after all of its deps have resolved', async () => {
    const log = [];
    await runTasks({
      a: { deps: [], run: () => sleep(20).then(() => log.push('a done')) },
      b: { deps: [], run: () => sleep(5).then(() => log.push('b done')) },
      c: { deps: ['a', 'b'], run: async () => log.push('c started') },
    });
    expect(log).toEqual(['b done', 'a done', 'c started']);
  });

  test('independent tasks run in parallel', async () => {
    let inFlight = 0;
    let max = 0;
    const work = async () => {
      inFlight += 1;
      max = Math.max(max, inFlight);
      await sleep(30);
      inFlight -= 1;
    };
    const start = Date.now();
    await runTasks({
      root: { deps: [], run: work },
      left: { deps: ['root'], run: work },
      right: { deps: ['root'], run: work },
      other: { deps: [], run: work },
    });
    expect(max).toBeGreaterThanOrEqual(2);
    // root/other in parallel (~30 ms), then left/right in parallel (~30 ms); serial would be ~120 ms.
    expect(Date.now() - start).toBeLessThan(100);
  });

  test('a shared dependency runs exactly once', async () => {
    const shared = jest.fn(async () => 'shared');
    await runTasks({
      shared: { deps: [], run: shared },
      x: { deps: ['shared'], run: async () => 'x' },
      y: { deps: ['shared'], run: async () => 'y' },
      z: { deps: ['x', 'y', 'shared'], run: async () => 'z' },
    });
    expect(shared).toHaveBeenCalledTimes(1);
  });

  test('an empty task map resolves to {}', async () => {
    await expect(runTasks({})).resolves.toEqual({});
  });

  test('a task depending on itself is a cycle', async () => {
    await expect(runTasks({ a: { deps: ['a'], run: async () => 1 } })).rejects.toThrow('cycle');
  });

  test('a longer cycle is detected and no task runs', async () => {
    const run = jest.fn(async () => 1);
    const error = await catchError(
      runTasks({
        start: { deps: [], run },
        a: { deps: ['start', 'c'], run },
        b: { deps: ['a'], run },
        c: { deps: ['b'], run },
      }),
    );
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toMatch(/cycle/);
    expect(run).not.toHaveBeenCalled();
  });

  test('a missing dependency rejects with "Unknown dependency" and no task runs', async () => {
    const run = jest.fn(async () => 1);
    const error = await catchError(runTasks({ a: { deps: [], run }, b: { deps: ['a', 'ghost'], run } }));
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toMatch(/Unknown dependency/);
    expect(run).not.toHaveBeenCalled();
  });

  test('a failing task rejects the run and its dependents never start', async () => {
    const dependent = jest.fn(async () => 'never');
    const error = await catchError(
      runTasks({
        ok: { deps: [], run: async () => 'ok' },
        bad: { deps: [], run: () => sleep(5).then(() => Promise.reject(new Error('task bad failed'))) },
        after: { deps: ['bad'], run: dependent },
      }),
    );
    expect(error.message).toBe('task bad failed');
    await sleep(10);
    expect(dependent).not.toHaveBeenCalled();
  });

  test('always returns a promise, even for an invalid graph', () => {
    let result;
    expect(() => {
      result = runTasks({ a: { deps: ['missing'], run: async () => 1 } });
    }).not.toThrow();
    expect(result).toBeInstanceOf(Promise);
    return result.catch(() => {});
  });
});
