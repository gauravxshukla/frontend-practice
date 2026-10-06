import promiseWithResolvers from './solution.js';

describe('promiseWithResolvers', () => {
  test('returns a promise and two functions', () => {
    const { promise, resolve, reject } = promiseWithResolvers();
    expect(promise instanceof Promise).toBe(true);
    expect(typeof resolve).toBe('function');
    expect(typeof reject).toBe('function');
  });

  test('resolves from outside', async () => {
    const { promise, resolve } = promiseWithResolvers();
    setTimeout(() => resolve('done'), 5);
    expect(await promise).toBe('done');
  });

  test('rejects from outside', async () => {
    const { promise, reject } = promiseWithResolvers();
    reject('nope');
    let reason;
    try {
      await promise;
    } catch (e) {
      reason = e;
    }
    expect(reason).toBe('nope');
  });
});
