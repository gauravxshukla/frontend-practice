import ExpiringStorage from './solution.js';

/** A tiny localStorage stand-in that records what it holds. */
function createFakeStorage() {
  const data = new Map();
  return {
    data,
    getItem: jest.fn((key) => (data.has(key) ? data.get(key) : null)),
    setItem: jest.fn((key, value) => data.set(key, String(value))),
    removeItem: jest.fn((key) => data.delete(key)),
  };
}

/** A clock the test moves by hand. */
function createClock(start = 1000) {
  const clock = { time: start, now: () => clock.time };
  return clock;
}

describe('ExpiringStorage', () => {
  test('example: returns the value before it expires', () => {
    const clock = createClock();
    const store = new ExpiringStorage(createFakeStorage(), clock.now);
    store.setItem('token', { id: 7 }, 500);
    clock.time = 1499;
    expect(store.getItem('token')).toEqual({ id: 7 });
  });

  test('example: returns null once expired and removes the key', () => {
    const storage = createFakeStorage();
    const clock = createClock();
    const store = new ExpiringStorage(storage, clock.now);
    store.setItem('token', { id: 7 }, 500);
    clock.time = 1500;
    expect(store.getItem('token')).toBeNull();
    expect(storage.removeItem).toHaveBeenCalledWith('token');
    expect(storage.data.has('token')).toBe(false);
  });

  test('stores the value and its expiry as JSON in the underlying storage', () => {
    const storage = createFakeStorage();
    const store = new ExpiringStorage(storage, () => 1000);
    store.setItem('a', [1, 'two'], 250);
    store.setItem('b', 'forever');
    expect(JSON.parse(storage.data.get('a'))).toEqual({ value: [1, 'two'], expiresAt: 1250 });
    expect(JSON.parse(storage.data.get('b'))).toEqual({ value: 'forever', expiresAt: null });
  });

  test('without a ttl the entry never expires', () => {
    const clock = createClock();
    const store = new ExpiringStorage(createFakeStorage(), clock.now);
    store.setItem('k', 'v');
    store.setItem('n', 'v', null);
    clock.time = Number.MAX_SAFE_INTEGER;
    expect(store.getItem('k')).toBe('v');
    expect(store.getItem('n')).toBe('v');
  });

  test('returns null for a missing key without removing anything', () => {
    const storage = createFakeStorage();
    const store = new ExpiringStorage(storage, () => 0);
    expect(store.getItem('missing')).toBeNull();
    expect(storage.removeItem).not.toHaveBeenCalled();
  });

  test('round-trips falsy and nested JSON values as equal copies', () => {
    const store = new ExpiringStorage(createFakeStorage(), () => 0);
    const nested = { a: { b: [1, { c: true }] } };
    store.setItem('obj', nested, 100);
    store.setItem('zero', 0, 100);
    store.setItem('false', false, 100);
    store.setItem('empty', '', 100);
    expect(store.getItem('obj')).toEqual(nested);
    expect(store.getItem('obj')).not.toBe(nested);
    expect(store.getItem('zero')).toBe(0);
    expect(store.getItem('false')).toBe(false);
    expect(store.getItem('empty')).toBe('');
  });

  test('a ttl of 0 expires immediately', () => {
    const store = new ExpiringStorage(createFakeStorage(), () => 1000);
    store.setItem('k', 'v', 0);
    expect(store.getItem('k')).toBeNull();
  });

  test('setting a key again replaces its value and expiry', () => {
    const clock = createClock();
    const store = new ExpiringStorage(createFakeStorage(), clock.now);
    store.setItem('k', 'old', 100);
    store.setItem('k', 'new');
    clock.time = 5000;
    expect(store.getItem('k')).toBe('new');
  });

  test('removeItem deletes the entry from the underlying storage', () => {
    const storage = createFakeStorage();
    const store = new ExpiringStorage(storage, () => 0);
    store.setItem('k', 'v');
    store.removeItem('k');
    expect(store.getItem('k')).toBeNull();
    expect(storage.data.has('k')).toBe(false);
  });

  test('returns null for raw values it did not write, without throwing', () => {
    const storage = createFakeStorage();
    storage.data.set('bad', '{not json');
    const store = new ExpiringStorage(storage, () => 0);
    expect(store.getItem('bad')).toBeNull();
  });

  test('defaults to an in-memory storage that is separate per instance', () => {
    const a = new ExpiringStorage();
    const b = new ExpiringStorage();
    a.setItem('k', 'v', 60_000);
    expect(a.getItem('k')).toBe('v');
    expect(b.getItem('k')).toBeNull();
  });
});
