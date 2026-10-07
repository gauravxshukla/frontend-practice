import promiseWithResolvers from './solution.js';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('promiseWithResolvers', () => {
  test('example: resolves from outside', async () => {
    const { promise, resolve } = promiseWithResolvers();
    setTimeout(() => resolve('done'), 5);
    expect(await promise).toBe('done');
  });

  test('example: rejects from outside', async () => {
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

  test('returns a promise and two functions', () => {
    const { promise, resolve, reject } = promiseWithResolvers();
    expect(promise instanceof Promise).toBe(true);
    expect(typeof resolve).toBe('function');
    expect(typeof reject).toBe('function');
  });

  test('the promise stays pending until settled', async () => {
    const { promise, resolve } = promiseWithResolvers();
    const onSettle = jest.fn();
    promise.then(onSettle, onSettle);
    await sleep(10);
    expect(onSettle).not.toHaveBeenCalled();
    resolve(1);
    await promise;
    expect(onSettle).toHaveBeenCalledTimes(1);
    expect(onSettle).toHaveBeenCalledWith(1);
  });

  test('only the first settle call counts', async () => {
    const { promise, resolve, reject } = promiseWithResolvers();
    resolve('first');
    resolve('second');
    reject(new Error('ignored'));
    expect(await promise).toBe('first');
  });

  test('a rejection after the first reject is ignored too', async () => {
    const { promise, resolve, reject } = promiseWithResolvers();
    const error = new Error('first');
    reject(error);
    reject(new Error('second'));
    resolve('ignored');
    await expect(promise).rejects.toBe(error);
  });

  test('resolving with another promise adopts its outcome', async () => {
    const outer = promiseWithResolvers();
    outer.resolve(Promise.reject('inner failed'));
    await expect(outer.promise).rejects.toBe('inner failed');

    const other = promiseWithResolvers();
    other.resolve({ then: (onFulfilled) => onFulfilled('from thenable') });
    expect(await other.promise).toBe('from thenable');
  });

  test('resolve and reject work when detached from the object', async () => {
    const { promise, resolve } = promiseWithResolvers();
    setTimeout(resolve, 5, 'via callback');
    expect(await promise).toBe('via callback');
  });

  test('each call returns an independent set', async () => {
    const a = promiseWithResolvers();
    const b = promiseWithResolvers();
    expect(a.promise).not.toBe(b.promise);
    a.resolve('a');
    b.reject('b');
    expect(await a.promise).toBe('a');
    await expect(b.promise).rejects.toBe('b');
  });

  test('does not use the native Promise.withResolvers', () => {
    if (typeof Promise.withResolvers !== 'function') return;
    const spy = jest.spyOn(Promise, 'withResolvers');
    try {
      promiseWithResolvers();
      expect(spy).not.toHaveBeenCalled();
    } finally {
      spy.mockRestore();
    }
  });
});
