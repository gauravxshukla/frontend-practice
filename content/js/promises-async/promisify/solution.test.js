import promisify from './solution.js';

function readConfig(name, callback) {
  setTimeout(() => (name ? callback(null, { name }) : callback(new Error('no name'))), 10);
}

describe('promisify', () => {
  test('example: resolves with the callback value', async () => {
    const readConfigAsync = promisify(readConfig);
    await expect(readConfigAsync('app')).resolves.toEqual({ name: 'app' });
  });

  test('example: rejects with the callback error', async () => {
    const readConfigAsync = promisify(readConfig);
    await expect(readConfigAsync('')).rejects.toThrow('no name');
  });

  test('returns a promise', () => {
    const wrapped = promisify((cb) => cb(null, 1));
    expect(wrapped()).toBeInstanceOf(Promise);
  });

  test('appends the callback after the given arguments', async () => {
    const fn = jest.fn((a, b, cb) => cb(null, a + b));
    await expect(promisify(fn)(2, 3)).resolves.toBe(5);
    const args = fn.mock.calls[0];
    expect(args).toHaveLength(3);
    expect(args[0]).toBe(2);
    expect(args[1]).toBe(3);
    expect(args[2]).toBeTypeOf('function');
  });

  test('preserves this', async () => {
    const store = {
      prefix: 'user:',
      get(id, cb) {
        cb(null, this.prefix + id);
      },
    };
    store.getAsync = promisify(store.get);
    await expect(store.getAsync(7)).resolves.toBe('user:7');
  });

  test('a null or undefined error resolves', async () => {
    await expect(promisify((cb) => cb(null, 'a'))()).resolves.toBe('a');
    await expect(promisify((cb) => cb(undefined, 'b'))()).resolves.toBe('b');
    await expect(promisify((cb) => cb())()).resolves.toBeUndefined();
  });

  test('a synchronous throw inside fn rejects instead of throwing', async () => {
    const wrapped = promisify(() => {
      throw new Error('sync boom');
    });
    let result;
    expect(() => {
      result = wrapped();
    }).not.toThrow();
    await expect(result).rejects.toThrow('sync boom');
  });

  test('only the first callback invocation counts', async () => {
    const wrapped = promisify((cb) => {
      cb(null, 'first');
      cb(null, 'second');
      cb(new Error('late error'));
    });
    await expect(wrapped()).resolves.toBe('first');
  });

  test('an error first wins over a later success', async () => {
    const wrapped = promisify((cb) => {
      cb(new Error('first error'));
      cb(null, 'ignored');
    });
    await expect(wrapped()).rejects.toThrow('first error');
  });

  test('calls fn again on every call of the wrapper', async () => {
    const fn = jest.fn((x, cb) => cb(null, x * 2));
    const wrapped = promisify(fn);
    await expect(wrapped(1)).resolves.toBe(2);
    await expect(wrapped(5)).resolves.toBe(10);
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
