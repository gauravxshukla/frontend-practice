import createTimeoutRegistry from './solution.js';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('createTimeoutRegistry', () => {
  test('example: clearAllTimeouts cancels every pending timer', async () => {
    const timers = createTimeoutRegistry();
    const a = jest.fn();
    const b = jest.fn();
    timers.setTimeout(a, 10);
    timers.setTimeout(b, 20);
    timers.clearAllTimeouts();
    await sleep(40);
    expect(a).not.toHaveBeenCalled();
    expect(b).not.toHaveBeenCalled();
  });

  test('example: clearTimeout cancels a single timer', async () => {
    const timers = createTimeoutRegistry();
    const a = jest.fn();
    const b = jest.fn();
    timers.setTimeout(a, 10);
    const id = timers.setTimeout(b, 10);
    timers.clearTimeout(id);
    await sleep(40);
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).not.toHaveBeenCalled();
  });

  test('timers fire normally with their arguments', async () => {
    const timers = createTimeoutRegistry();
    const spy = jest.fn();
    timers.setTimeout(spy, 10, 'x', 2);
    expect(spy).not.toHaveBeenCalled();
    await sleep(40);
    expect(spy).toHaveBeenCalledWith('x', 2);
  });

  test('does not modify the global timer functions', () => {
    const originalSet = globalThis.setTimeout;
    const originalClear = globalThis.clearTimeout;
    const timers = createTimeoutRegistry();
    timers.setTimeout(() => {}, 10);
    timers.clearAllTimeouts();
    expect(globalThis.setTimeout).toBe(originalSet);
    expect(globalThis.clearTimeout).toBe(originalClear);
  });

  test('does not affect timers outside the registry', async () => {
    const timers = createTimeoutRegistry();
    const other = createTimeoutRegistry();
    const outside = jest.fn();
    const fromOther = jest.fn();
    const id = setTimeout(outside, 10);
    other.setTimeout(fromOther, 10);
    timers.setTimeout(() => {}, 10);
    timers.clearAllTimeouts();
    await sleep(40);
    expect(outside).toHaveBeenCalledTimes(1);
    expect(fromOther).toHaveBeenCalledTimes(1);
    clearTimeout(id);
  });

  test('forgets timers that have already fired', async () => {
    const timers = createTimeoutRegistry();
    timers.setTimeout(() => {}, 5);
    timers.setTimeout(() => {}, 5);
    await sleep(30);
    const spy = jest.spyOn(globalThis, 'clearTimeout');
    try {
      timers.clearAllTimeouts();
      expect(spy).not.toHaveBeenCalled();
    } finally {
      spy.mockRestore();
    }
  });

  test('forgets timers cleared individually', () => {
    const timers = createTimeoutRegistry();
    const id = timers.setTimeout(() => {}, 50);
    timers.clearTimeout(id);
    const spy = jest.spyOn(globalThis, 'clearTimeout');
    try {
      timers.clearAllTimeouts();
      expect(spy).not.toHaveBeenCalled();
    } finally {
      spy.mockRestore();
    }
  });

  test('only clears the timers still pending', async () => {
    const timers = createTimeoutRegistry();
    const fast = jest.fn();
    const slow = jest.fn();
    timers.setTimeout(fast, 5);
    timers.setTimeout(slow, 60);
    await sleep(30);
    timers.clearAllTimeouts();
    await sleep(60);
    expect(fast).toHaveBeenCalledTimes(1);
    expect(slow).not.toHaveBeenCalled();
  });

  test('keeps working after clearAllTimeouts', async () => {
    const timers = createTimeoutRegistry();
    timers.setTimeout(() => {}, 10);
    timers.clearAllTimeouts();
    const spy = jest.fn();
    timers.setTimeout(spy, 10);
    await sleep(40);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('a timer scheduled from inside a callback is also tracked', async () => {
    const timers = createTimeoutRegistry();
    const inner = jest.fn();
    timers.setTimeout(() => {
      timers.setTimeout(inner, 40);
    }, 5);
    await sleep(25);
    timers.clearAllTimeouts();
    await sleep(50);
    expect(inner).not.toHaveBeenCalled();
  });
});
