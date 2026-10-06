import mapAsync from './solution.js';

const delay = (value, ms) => new Promise((resolve) => setTimeout(() => resolve(value), ms));

describe('mapAsync', () => {
  test('empty input', async () => {
    expect(await mapAsync([], (x) => delay(x, 1))).toEqual([]);
  });

  test('waits for all, keeps order even when the last item finishes first', async () => {
    const result = await mapAsync([30, 20, 1], (ms) => delay(ms * 2, ms));
    expect(result).toEqual([60, 40, 2]);
  });

  test('runs in parallel', async () => {
    const start = Date.now();
    await mapAsync([30, 30, 30], (ms) => delay(ms, ms));
    expect(Date.now() - start).toBeLessThan(80);
  });

  test('rejects if any callback rejects', async () => {
    let reason;
    try {
      await mapAsync([1, 2], (x) => (x === 2 ? Promise.reject('bad') : delay(x, 5)));
    } catch (e) {
      reason = e;
    }
    expect(reason).toBe('bad');
  });
});
