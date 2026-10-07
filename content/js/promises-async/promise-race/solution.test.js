import promiseRace from './solution.js';

const delay = (value, ms) => new Promise((resolve) => setTimeout(() => resolve(value), ms));
const fail = (reason, ms) => new Promise((_, reject) => setTimeout(() => reject(reason), ms));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('promiseRace', () => {
  test('example: resolves with the fastest', async () => {
    expect(await promiseRace([delay('slow', 40), delay('fast', 5)])).toBe('fast');
  });

  test('example: rejects if the fastest rejects', async () => {
    let reason;
    try {
      await promiseRace([delay('slow', 40), fail('boom', 5)]);
    } catch (e) {
      reason = e;
    }
    expect(reason).toBe('boom');
  });

  test('plain values win immediately', async () => {
    expect(await promiseRace([delay('slow', 20), 'now'])).toBe('now');
  });

  test('returns a promise', () => {
    expect(promiseRace([1])).toBeInstanceOf(Promise);
  });

  test('when several inputs reject, the earliest rejection wins', async () => {
    await expect(promiseRace([fail('late', 30), fail('early', 5)])).rejects.toBe('early');
  });

  test('a fulfilment that comes first beats a later rejection', async () => {
    expect(await promiseRace([fail('too late', 30), delay('ok', 5)])).toBe('ok');
  });

  test('later settlements are ignored', async () => {
    const onFulfilled = jest.fn();
    const onRejected = jest.fn();
    promiseRace([delay('first', 5), fail('second', 15), delay('third', 20)]).then(onFulfilled, onRejected);
    await sleep(40);
    expect(onFulfilled).toHaveBeenCalledTimes(1);
    expect(onFulfilled).toHaveBeenCalledWith('first');
    expect(onRejected).not.toHaveBeenCalled();
  });

  test('settles without waiting for slower inputs', async () => {
    const start = Date.now();
    await promiseRace([delay('slow', 100), delay('fast', 5)]);
    expect(Date.now() - start).toBeLessThan(70);
  });

  test('an empty input stays pending forever', async () => {
    const settled = jest.fn();
    promiseRace([]).then(settled, settled);
    await sleep(20);
    expect(settled).not.toHaveBeenCalled();
  });

  test('passes the rejection reason through unchanged', async () => {
    const error = new Error('nope');
    let reason;
    try {
      await promiseRace([Promise.reject(error), delay('later', 10)]);
    } catch (e) {
      reason = e;
    }
    expect(reason).toBe(error);
  });

  test('does not use the native Promise.race', async () => {
    const spy = jest.spyOn(Promise, 'race');
    try {
      await promiseRace([delay(1, 5)]);
      expect(spy).not.toHaveBeenCalled();
    } finally {
      spy.mockRestore();
    }
  });
});
