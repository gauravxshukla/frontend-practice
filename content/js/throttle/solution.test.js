import throttle from './solution.js';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('throttle', () => {
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

  test('allows a call after the window', async () => {
    const received = [];
    const fn = throttle((x) => received.push(x), 30);
    fn('a');
    fn('b');
    await sleep(45);
    fn('c');
    expect(received).toEqual(['a', 'c']);
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
});
