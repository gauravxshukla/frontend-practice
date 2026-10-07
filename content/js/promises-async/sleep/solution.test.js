import sleep from './solution.js';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('sleep', () => {
  test('example: resolves after about ms', async () => {
    const start = Date.now();
    await sleep(40);
    expect(Date.now() - start).toBeGreaterThanOrEqual(35);
  });

  test('example: then runs after the synchronous code', async () => {
    const log = [];
    const done = sleep(0).then(() => log.push('second'));
    log.push('first');
    await done;
    expect(log).toEqual(['first', 'second']);
  });

  test('returns a Promise', () => {
    expect(sleep(0)).toBeInstanceOf(Promise);
  });

  test('resolves with undefined', async () => {
    await expect(sleep(5)).resolves.toBeUndefined();
  });

  test('sleep(0) resolves', async () => {
    await expect(sleep(0)).resolves.toBeUndefined();
  });

  test('does not resolve early', async () => {
    let done = false;
    sleep(60).then(() => {
      done = true;
    });
    await wait(10);
    expect(done).toBe(false);
    await wait(90);
    expect(done).toBe(true);
  });

  test('concurrent sleeps are independent and finish in order of duration', async () => {
    const order = [];
    await Promise.all([
      sleep(50).then(() => order.push(50)),
      sleep(10).then(() => order.push(10)),
      sleep(30).then(() => order.push(30)),
    ]);
    expect(order).toEqual([10, 30, 50]);
  });
});
