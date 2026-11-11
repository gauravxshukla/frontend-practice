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
    // margins of ~100ms either side keep this stable on a busy machine
    const tryAcquire = createRateLimiter(2, 300);
    expect(tryAcquire()).toBe(true); // t ≈ 0
    await sleep(150);
    expect(tryAcquire()).toBe(true); // t ≈ 150
    expect(tryAcquire()).toBe(false);
    await sleep(200); // t ≈ 350: the first call has expired, the second hasn't
    expect(tryAcquire()).toBe(true);
    expect(tryAcquire()).toBe(false);
  });

  test('rejected calls do not take a slot', async () => {
    // margins of ~100ms either side keep this stable on a busy machine
    const tryAcquire = createRateLimiter(1, 200);
    expect(tryAcquire()).toBe(true);
    await sleep(60);
    expect(tryAcquire()).toBe(false);
    await sleep(180); // ~240ms after the only allowed call, ~180ms after the rejected one
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
