import createRateLimiter from './solution.js';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('createRateLimiter', () => {
  test('example: allows up to limit calls, then rejects', () => {
    const tryAcquire = createRateLimiter(2, 1000);
    expect(tryAcquire()).toBe(true);
    expect(tryAcquire()).toBe(true);
    expect(tryAcquire()).toBe(false);
    expect(tryAcquire()).toBe(false);
  });

  test('example: allows calls again once the window has passed', async () => {
    const tryAcquire = createRateLimiter(2, 40);
    tryAcquire();
    tryAcquire();
    expect(tryAcquire()).toBe(false);
    await sleep(60);
    expect(tryAcquire()).toBe(true);
    expect(tryAcquire()).toBe(true);
    expect(tryAcquire()).toBe(false);
  });

  test('limit of 1', () => {
    const tryAcquire = createRateLimiter(1, 1000);
    expect(tryAcquire()).toBe(true);
    expect(tryAcquire()).toBe(false);
  });

  test('the window slides: slots free up one at a time', async () => {
    const tryAcquire = createRateLimiter(2, 80);
    expect(tryAcquire()).toBe(true); // t ≈ 0
    await sleep(50);
    expect(tryAcquire()).toBe(true); // t ≈ 50
    expect(tryAcquire()).toBe(false);
    await sleep(50); // t ≈ 100: the first call has expired, the second hasn't
    expect(tryAcquire()).toBe(true);
    expect(tryAcquire()).toBe(false);
  });

  test('rejected calls do not take a slot', async () => {
    const tryAcquire = createRateLimiter(1, 40);
    expect(tryAcquire()).toBe(true);
    await sleep(30);
    expect(tryAcquire()).toBe(false);
    await sleep(20); // ~50ms after the only allowed call, ~20ms after the rejected one
    expect(tryAcquire()).toBe(true);
  });

  test('limiters are independent', () => {
    const a = createRateLimiter(1, 1000);
    const b = createRateLimiter(1, 1000);
    expect(a()).toBe(true);
    expect(a()).toBe(false);
    expect(b()).toBe(true);
  });

  test('never allows more than limit calls in a burst', () => {
    const tryAcquire = createRateLimiter(5, 1000);
    const results = Array.from({ length: 20 }, () => tryAcquire());
    expect(results.filter(Boolean)).toHaveLength(5);
    expect(results.slice(0, 5)).toEqual([true, true, true, true, true]);
  });
});
