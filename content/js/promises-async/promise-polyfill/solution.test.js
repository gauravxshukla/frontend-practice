import MyPromise from './solution.js';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('MyPromise', () => {
  test('example: resolves asynchronously and chains values through then', async () => {
    const p = new MyPromise((resolve) => setTimeout(() => resolve(1), 10));
    const result = await p.then((x) => x + 1).then((x) => x * 10);
    expect(result).toBe(20);
  });

  test('example: an error skips later thens until catch, and sync code runs first', async () => {
    const log = [];
    const done = MyPromise.resolve(1)
      .then((x) => {
        throw new Error(`bad ${x + 1}`);
      })
      .then(() => log.push('skipped'))
      .catch((e) => log.push(e.message));
    log.push('sync first');
    await done;
    expect(log).toEqual(['sync first', 'bad 2']);
  });

  test('then returns a new MyPromise', () => {
    const p = MyPromise.resolve(1);
    const child = p.then((x) => x);
    expect(child).toBeInstanceOf(MyPromise);
    expect(child).not.toBe(p);
  });

  test('the executor runs synchronously', () => {
    let ran = false;
    new MyPromise(() => {
      ran = true;
    });
    expect(ran).toBe(true);
  });

  test('a throw inside the executor rejects', async () => {
    const p = new MyPromise(() => {
      throw new Error('executor failed');
    });
    await expect(p.then(() => 'no', (e) => e.message)).resolves.toBe('executor failed');
  });

  test('settles only once', async () => {
    const p = new MyPromise((resolve, reject) => {
      resolve('first');
      reject(new Error('ignored'));
      resolve('also ignored');
    });
    await expect(p.then((v) => v)).resolves.toBe('first');

    const q = new MyPromise((resolve, reject) => {
      reject('no');
      resolve('ignored');
    });
    await expect(q.then(() => 'fulfilled', (r) => `rejected ${r}`)).resolves.toBe('rejected no');
  });

  test('a throw after resolve in the executor is ignored', async () => {
    const p = new MyPromise((resolve) => {
      resolve('kept');
      throw new Error('too late');
    });
    await expect(p.then((v) => v)).resolves.toBe('kept');
  });

  test('then callbacks run asynchronously even when already settled', () => {
    const log = [];
    MyPromise.resolve('v').then(() => log.push('then'));
    log.push('sync');
    expect(log).toEqual(['sync']);
    return MyPromise.resolve().then(() => {
      expect(log).toEqual(['sync', 'then']);
    });
  });

  test('callbacks on one promise run in registration order', async () => {
    const log = [];
    let resolve;
    const p = new MyPromise((r) => {
      resolve = r;
    });
    p.then(() => log.push(1));
    p.then(() => log.push(2));
    p.then(() => log.push(3));
    resolve();
    await sleep(0);
    expect(log).toEqual([1, 2, 3]);
  });

  test('missing callbacks pass values and rejections through', async () => {
    await expect(MyPromise.resolve('kept').then().then(null, null).then((v) => v)).resolves.toBe('kept');
    const reason = await MyPromise.reject('err')
      .then((v) => v)
      .then(undefined, (r) => r);
    expect(reason).toBe('err');
  });

  test('catch can recover and the chain continues', async () => {
    const result = await MyPromise.reject(new Error('boom'))
      .catch(() => 'recovered')
      .then((v) => `${v}!`);
    expect(result).toBe('recovered!');
  });

  test('a returned MyPromise is adopted', async () => {
    const result = await MyPromise.resolve(1).then((x) => new MyPromise((resolve) => setTimeout(() => resolve(x + 41), 10)));
    expect(result).toBe(42);
  });

  test('a returned thenable or native Promise is adopted', async () => {
    const thenable = {
      then(onFulfilled) {
        setTimeout(() => onFulfilled('from thenable'), 5);
      },
    };
    await expect(MyPromise.resolve(0).then(() => thenable)).resolves.toBe('from thenable');
    await expect(MyPromise.resolve(0).then(() => Promise.resolve('native'))).resolves.toBe('native');
    await expect(new MyPromise((resolve) => resolve(Promise.reject(new Error('native rejection'))))).rejects.toThrow('native rejection');
  });

  test('a thenable that calls back twice or throws afterwards only counts once', async () => {
    const thenable = {
      then(onFulfilled, onRejected) {
        onFulfilled('first');
        onRejected(new Error('ignored'));
        throw new Error('also ignored');
      },
    };
    await expect(MyPromise.resolve(thenable)).resolves.toBe('first');
  });

  test('returning the promise itself rejects with a TypeError', async () => {
    const p = MyPromise.resolve(1).then(() => p);
    const reason = await p.then(
      () => null,
      (e) => e,
    );
    expect(reason).toBeInstanceOf(TypeError);
  });

  test('finally passes the value or rejection through and gets no arguments', async () => {
    const onFinally = jest.fn();
    await expect(MyPromise.resolve('value').finally(onFinally)).resolves.toBe('value');
    expect(onFinally).toHaveBeenCalledWith();
    await expect(MyPromise.reject(new Error('reason')).finally(() => 'ignored')).rejects.toThrow('reason');
  });

  test('a throw inside finally overrides the outcome', async () => {
    const p = MyPromise.resolve('value').finally(() => {
      throw new Error('finally failed');
    });
    await expect(p).rejects.toThrow('finally failed');
  });

  test('finally waits for a returned promise', async () => {
    const log = [];
    await MyPromise.resolve('v')
      .finally(() => sleep(20).then(() => log.push('cleanup')))
      .then((v) => log.push(v));
    expect(log).toEqual(['cleanup', 'v']);
  });

  test('MyPromise.resolve returns the same instance for a MyPromise', () => {
    const p = new MyPromise(() => {});
    expect(MyPromise.resolve(p)).toBe(p);
    expect(MyPromise.resolve(1)).toBeInstanceOf(MyPromise);
  });

  test('MyPromise.reject rejects with the reason as is', async () => {
    const inner = MyPromise.resolve('not adopted');
    let reason;
    await MyPromise.reject(inner).catch((r) => {
      reason = r; // Capture rather than return it: a returned MyPromise would be adopted.
    });
    expect(reason).toBe(inner);
  });

  test('works with await because it is a thenable', async () => {
    expect(await MyPromise.resolve(42)).toBe(42);
    let caught;
    try {
      await MyPromise.reject(new Error('awaited rejection'));
    } catch (e) {
      caught = e;
    }
    expect(caught.message).toBe('awaited rejection');
  });
});
