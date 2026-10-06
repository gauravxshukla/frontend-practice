import debounce from './solution.js';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('debounce', () => {
  test('does not call immediately', () => {
    let calls = 0;
    const fn = debounce(() => calls++, 20);
    fn();
    expect(calls).toBe(0);
  });

  test('calls once after a burst, with the latest arguments', async () => {
    const received = [];
    const fn = debounce((x) => received.push(x), 20);
    fn('a');
    fn('b');
    fn('c');
    await sleep(50);
    expect(received).toEqual(['c']);
  });

  test('each call restarts the timer', async () => {
    let calls = 0;
    const fn = debounce(() => calls++, 30);
    fn();
    await sleep(15);
    fn();
    await sleep(20);
    expect(calls).toBe(0);
    await sleep(30);
    expect(calls).toBe(1);
  });

  test('preserves this', async () => {
    let seen;
    const obj = { name: 'obj', fn: debounce(function () { seen = this.name; }, 10) };
    obj.fn();
    await sleep(30);
    expect(seen).toBe('obj');
  });
});
