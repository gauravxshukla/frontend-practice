import mapAsyncLimit from './solution.js';

const delay = (value, ms) => new Promise((resolve) => setTimeout(() => resolve(value), ms));

/** Wraps an async fn and records the peak number of concurrent calls. */
function tracked(fn) {
  const stats = { inFlight: 0, max: 0 };
  const wrapped = async (...args) => {
    stats.inFlight += 1;
    stats.max = Math.max(stats.max, stats.inFlight);
    try {
      return await fn(...args);
    } finally {
      stats.inFlight -= 1;
    }
  };
  return { wrapped, stats };
}

describe('mapAsyncLimit', () => {
  test('example: resolves with results in input order', async () => {
    const fetchUser = (id) => delay({ id }, 10);
    const result = await mapAsyncLimit([1, 2, 3, 4, 5], 2, fetchUser);
    expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]);
  });

  test('example: never runs more than limit calls at once', async () => {
    const { wrapped, stats } = tracked((x) => delay(x, 10));
    await mapAsyncLimit([1, 2, 3, 4, 5, 6, 7], 3, wrapped);
    expect(stats.max).toBe(3);
  });

  test('keeps input order even when later items finish first', async () => {
    const result = await mapAsyncLimit([40, 5, 20, 1], 4, (ms) => delay(ms * 10, ms));
    expect(result).toEqual([400, 50, 200, 10]);
  });

  test('passes the item and its index', async () => {
    const fn = jest.fn((item, index) => Promise.resolve(`${item}${index}`));
    await expect(mapAsyncLimit(['a', 'b'], 1, fn)).resolves.toEqual(['a0', 'b1']);
    expect(fn).toHaveBeenNthCalledWith(1, 'a', 0);
    expect(fn).toHaveBeenNthCalledWith(2, 'b', 1);
  });

  test('starts the next item as soon as one finishes, not in batches', async () => {
    const t0 = Date.now();
    const startedAt = [];
    await mapAsyncLimit([80, 10, 10, 10], 2, (ms, i) => {
      startedAt[i] = Date.now() - t0;
      return delay(ms, ms);
    });
    // A pool starts item 2 when item 1 finishes (~10 ms); batching would wait for item 0 (~80 ms).
    expect(startedAt[2]).toBeLessThan(50);
    expect(startedAt[3]).toBeLessThan(50);
  });

  test('limit 1 runs the items one at a time, in order', async () => {
    const order = [];
    const { wrapped, stats } = tracked(async (x) => {
      order.push(x);
      return delay(x, 5);
    });
    await mapAsyncLimit(['a', 'b', 'c'], 1, wrapped);
    expect(stats.max).toBe(1);
    expect(order).toEqual(['a', 'b', 'c']);
  });

  test('rejects on the first failure and starts no further items', async () => {
    const fn = jest.fn((x) => (x === 2 ? Promise.reject(new Error('item 2 failed')) : delay(x, 5)));
    await expect(mapAsyncLimit([1, 2, 3, 4], 1, fn)).rejects.toThrow('item 2 failed');
    await delay(null, 20);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  test('an empty input resolves to []', async () => {
    const fn = jest.fn();
    await expect(mapAsyncLimit([], 3, fn)).resolves.toEqual([]);
    expect(fn).not.toHaveBeenCalled();
  });

  test('a limit larger than the input runs everything at once', async () => {
    const { wrapped, stats } = tracked((x) => delay(x, 20));
    const start = Date.now();
    await expect(mapAsyncLimit([1, 2, 3], 10, wrapped)).resolves.toEqual([1, 2, 3]);
    expect(stats.max).toBe(3);
    expect(Date.now() - start).toBeLessThan(55);
  });

  test('does not mutate the input array', async () => {
    const items = [3, 1, 2];
    await mapAsyncLimit(items, 2, (x) => delay(x * 2, x));
    expect(items).toEqual([3, 1, 2]);
  });
});
