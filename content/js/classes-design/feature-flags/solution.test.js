import createFeatureFlags from './solution.js';

/** A promise you resolve or reject by hand. */
function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe('createFeatureFlags', () => {
  test('example: concurrent first calls share one fetch', async () => {
    const fetchFlags = jest.fn(() => Promise.resolve({ newCheckout: true, darkMode: false }));
    const flags = createFeatureFlags(fetchFlags);
    const results = await Promise.all([
      flags.isEnabled('newCheckout'),
      flags.isEnabled('darkMode'),
      flags.isEnabled('newCheckout'),
    ]);
    expect(results).toEqual([true, false, true]);
    expect(fetchFlags).toHaveBeenCalledTimes(1);
  });

  test('example: a missing flag resolves with the fallback', async () => {
    const flags = createFeatureFlags(() => Promise.resolve({ darkMode: true }));
    await expect(flags.isEnabled('missing', true)).resolves.toBe(true);
    await expect(flags.isEnabled('missing')).resolves.toBe(false);
  });

  test('does not fetch until a flag is requested', () => {
    const fetchFlags = jest.fn(() => Promise.resolve({}));
    createFeatureFlags(fetchFlags);
    expect(fetchFlags).not.toHaveBeenCalled();
  });

  test('caches the flags after the first fetch', async () => {
    const fetchFlags = jest.fn(() => Promise.resolve({ a: true }));
    const flags = createFeatureFlags(fetchFlags);
    await flags.isEnabled('a');
    await flags.isEnabled('a');
    await flags.isEnabled('b');
    expect(fetchFlags).toHaveBeenCalledTimes(1);
  });

  test('a flag that is explicitly false wins over a true fallback', async () => {
    const flags = createFeatureFlags(() => Promise.resolve({ darkMode: false }));
    await expect(flags.isEnabled('darkMode', true)).resolves.toBe(false);
  });

  test('inherited keys are not flags', async () => {
    const flags = createFeatureFlags(() => Promise.resolve({}));
    await expect(flags.isEnabled('toString', true)).resolves.toBe(true);
    await expect(flags.isEnabled('constructor')).resolves.toBe(false);
  });

  test('a failed fetch resolves with the fallback and a later call retries', async () => {
    const fetchFlags = jest
      .fn()
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce({ beta: true });
    const flags = createFeatureFlags(fetchFlags);
    await expect(flags.isEnabled('beta', false)).resolves.toBe(false);
    await expect(flags.isEnabled('beta', false)).resolves.toBe(true);
    expect(fetchFlags).toHaveBeenCalledTimes(2);
  });

  test('a synchronous throw from fetchFlags also resolves with the fallback', async () => {
    const flags = createFeatureFlags(() => {
      throw new Error('boom');
    });
    await expect(flags.isEnabled('x', true)).resolves.toBe(true);
  });

  test('concurrent callers of a failing fetch all get their fallback from one call', async () => {
    const fetchFlags = jest.fn(() => Promise.reject(new Error('down')));
    const flags = createFeatureFlags(fetchFlags);
    const results = await Promise.all([flags.isEnabled('a', true), flags.isEnabled('b', false)]);
    expect(results).toEqual([true, false]);
    expect(fetchFlags).toHaveBeenCalledTimes(1);
  });

  test('refresh refetches and later calls see the new values', async () => {
    const fetchFlags = jest
      .fn()
      .mockResolvedValueOnce({ beta: false })
      .mockResolvedValueOnce({ beta: true });
    const flags = createFeatureFlags(fetchFlags);
    await expect(flags.isEnabled('beta')).resolves.toBe(false);
    await expect(flags.refresh()).resolves.toEqual({ beta: true });
    await expect(flags.isEnabled('beta')).resolves.toBe(true);
    expect(fetchFlags).toHaveBeenCalledTimes(2);
  });

  test('calls made during a refresh wait for it', async () => {
    const second = deferred();
    const fetchFlags = jest
      .fn()
      .mockResolvedValueOnce({ beta: false })
      .mockReturnValueOnce(second.promise);
    const flags = createFeatureFlags(fetchFlags);
    await flags.isEnabled('beta');
    const refreshing = flags.refresh();
    const during = flags.isEnabled('beta');
    second.resolve({ beta: true });
    await refreshing;
    await expect(during).resolves.toBe(true);
    expect(fetchFlags).toHaveBeenCalledTimes(2);
  });

  test('a failed refresh rejects and keeps the cached flags', async () => {
    const fetchFlags = jest
      .fn()
      .mockResolvedValueOnce({ beta: true })
      .mockRejectedValueOnce(new Error('down'));
    const flags = createFeatureFlags(fetchFlags);
    await flags.isEnabled('beta');
    const refreshing = flags.refresh();
    const during = flags.isEnabled('beta', false);
    await expect(refreshing).rejects.toThrow('down');
    await expect(during).resolves.toBe(true);
    await expect(flags.isEnabled('beta', false)).resolves.toBe(true);
  });

  test('clients are independent', async () => {
    const a = jest.fn(() => Promise.resolve({ x: true }));
    const b = jest.fn(() => Promise.resolve({ x: false }));
    const flagsA = createFeatureFlags(a);
    const flagsB = createFeatureFlags(b);
    await expect(flagsA.isEnabled('x')).resolves.toBe(true);
    await expect(flagsB.isEnabled('x')).resolves.toBe(false);
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
  });
});
