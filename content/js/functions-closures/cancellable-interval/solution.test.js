import setCancellableInterval from './solution.js';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('setCancellableInterval', () => {
  test('example: calls fn repeatedly with the given arguments', async () => {
    const spy = jest.fn();
    const cancel = setCancellableInterval(spy, 10, 'a', 1);
    await sleep(65);
    cancel();
    expect(spy.mock.calls.length).toBeGreaterThanOrEqual(2);
    expect(spy).toHaveBeenCalledWith('a', 1);
  });

  test('example: cancel stops future calls', async () => {
    const spy = jest.fn();
    const cancel = setCancellableInterval(spy, 10);
    await sleep(35);
    cancel();
    const count = spy.mock.calls.length;
    await sleep(40);
    expect(spy).toHaveBeenCalledTimes(count);
  });

  test('returns a function', () => {
    const cancel = setCancellableInterval(() => {}, 10);
    expect(cancel).toBeTypeOf('function');
    cancel();
  });

  test('does not call fn immediately', () => {
    const spy = jest.fn();
    const cancel = setCancellableInterval(spy, 10);
    expect(spy).not.toHaveBeenCalled();
    cancel();
  });

  test('cancelling before the first tick prevents every call', async () => {
    const spy = jest.fn();
    const cancel = setCancellableInterval(spy, 10);
    cancel();
    await sleep(40);
    expect(spy).not.toHaveBeenCalled();
  });

  test('cancelling twice is safe', async () => {
    const spy = jest.fn();
    const cancel = setCancellableInterval(spy, 10);
    cancel();
    expect(() => cancel()).not.toThrow();
    await sleep(30);
    expect(spy).not.toHaveBeenCalled();
  });

  test('intervals are independent', async () => {
    const a = jest.fn();
    const b = jest.fn();
    const cancelA = setCancellableInterval(a, 10);
    const cancelB = setCancellableInterval(b, 10);
    cancelA();
    await sleep(40);
    cancelB();
    expect(a).not.toHaveBeenCalled();
    expect(b.mock.calls.length).toBeGreaterThanOrEqual(1);
  });

  test('fn can cancel its own interval', async () => {
    let calls = 0;
    const cancel = setCancellableInterval(() => {
      calls++;
      if (calls === 2) cancel();
    }, 10);
    await sleep(80);
    expect(calls).toBe(2);
  });
});
