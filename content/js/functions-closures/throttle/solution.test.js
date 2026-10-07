import throttle from './solution.js';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('throttle', () => {
  test('example: calls immediately and ignores calls inside the window', () => {
    const spy = jest.fn();
    const fn = throttle(spy, 30);
    fn('a');
    expect(spy).toHaveBeenCalledTimes(1);
    fn('b');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('a');
  });

  test('example: allows a call after the window', async () => {
    const received = [];
    const fn = throttle((x) => received.push(x), 30);
    fn('a');
    fn('b');
    await sleep(45);
    fn('c');
    expect(received).toEqual(['a', 'c']);
  });

  test('calls immediately on the first call', () => {
    let calls = 0;
    const fn = throttle(() => calls++, 30);
    fn();
    expect(calls).toBe(1);
  });

  test('ignores calls inside the window', () => {
    let calls = 0;
    const fn = throttle(() => calls++, 30);
    fn();
    fn();
    fn();
    expect(calls).toBe(1);
  });

  test('ignored calls do not extend the window', async () => {
    let calls = 0;
    const fn = throttle(() => calls++, 40);
    fn();
    await sleep(20);
    fn(); // ignored
    await sleep(30); // 50ms since the first call: the window is open again
    fn();
    expect(calls).toBe(2);
  });

  test('preserves this and arguments', () => {
    let seen;
    const obj = { k: 2, fn: throttle(function (x) { seen = this.k * x; }, 10) };
    obj.fn(5);
    expect(seen).toBe(10);
  });

  test('ignored calls are dropped, not run later', async () => {
    const spy = jest.fn();
    const fn = throttle(spy, 20);
    fn('a');
    fn('b');
    fn('c');
    await sleep(60);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('a');
  });

  test('a call after the window opens a new window', async () => {
    const spy = jest.fn();
    const fn = throttle(spy, 25);
    fn(1);
    await sleep(40);
    fn(2); // runs and opens a new window
    fn(3); // ignored
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith(2);
  });

  test('forwards every argument', () => {
    const spy = jest.fn();
    throttle(spy, 10)('x', 1, { y: true });
    expect(spy).toHaveBeenCalledWith('x', 1, { y: true });
  });

  test('separate throttled functions have independent windows', () => {
    const spyA = jest.fn();
    const spyB = jest.fn();
    const a = throttle(spyA, 30);
    const b = throttle(spyB, 30);
    a();
    b();
    a();
    expect(spyA).toHaveBeenCalledTimes(1);
    expect(spyB).toHaveBeenCalledTimes(1);
  });
});
