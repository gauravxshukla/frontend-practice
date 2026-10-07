import retry from './solution.js';

describe('retry', () => {
  test('example: resolves once a later attempt succeeds', async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error('fail 1'))
      .mockRejectedValueOnce(new Error('fail 2'))
      .mockResolvedValue('ok');
    await expect(retry(fn, { retries: 3, delay: 5 })).resolves.toBe('ok');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  test('example: rejects after retries + 1 attempts', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('down'));
    await expect(retry(fn, { retries: 2 })).rejects.toThrow('down');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  test('rejects with the last error, not the first', async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error('first'))
      .mockRejectedValueOnce(new Error('second'))
      .mockRejectedValueOnce(new Error('last'));
    let error;
    try {
      await retry(fn, { retries: 2 });
    } catch (e) {
      error = e;
    }
    expect(error.message).toBe('last');
  });

  test('retries: 0 means a single attempt', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('once'));
    await expect(retry(fn, { retries: 0, delay: 5 })).rejects.toThrow('once');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('options are optional and default to a single attempt', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('no options'));
    await expect(retry(fn)).rejects.toThrow('no options');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('stops calling fn after the first success', async () => {
    const fn = jest.fn().mockResolvedValue(42);
    await expect(retry(fn, { retries: 5 })).resolves.toBe(42);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('waits delay ms between attempts', async () => {
    const fn = jest.fn().mockRejectedValueOnce(new Error('a')).mockRejectedValueOnce(new Error('b')).mockResolvedValue('done');
    const start = Date.now();
    await retry(fn, { retries: 2, delay: 30 });
    expect(Date.now() - start).toBeGreaterThanOrEqual(55);
  });

  test('does not wait before the first attempt', async () => {
    const fn = jest.fn().mockResolvedValue('fast');
    const start = Date.now();
    await retry(fn, { retries: 3, delay: 100 });
    expect(Date.now() - start).toBeLessThan(50);
  });

  test('does not wait after the final failure', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('nope'));
    const start = Date.now();
    await retry(fn, { retries: 1, delay: 40 }).catch(() => {});
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(35);
    expect(elapsed).toBeLessThan(75);
  });

  test('waits for each attempt to settle before starting the next', async () => {
    let inFlight = 0;
    let maxInFlight = 0;
    let calls = 0;
    const fn = () => {
      calls += 1;
      inFlight += 1;
      maxInFlight = Math.max(maxInFlight, inFlight);
      return new Promise((resolve, reject) =>
        setTimeout(() => {
          inFlight -= 1;
          if (calls < 3) reject(new Error('again'));
          else resolve('third time');
        }, 10),
      );
    };
    await expect(retry(fn, { retries: 4 })).resolves.toBe('third time');
    expect(maxInFlight).toBe(1);
  });
});
