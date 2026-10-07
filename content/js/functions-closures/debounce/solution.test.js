import debounce from './solution.js';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('debounce', () => {
  test('example: calls once after a burst, with the latest arguments', async () => {
    const received = [];
    const fn = debounce((x) => received.push(x), 20);
    fn('a');
    fn('b');
    fn('c');
    await sleep(50);
    expect(received).toEqual(['c']);
  });

  test('example: does not call immediately', () => {
    let calls = 0;
    const fn = debounce(() => calls++, 20);
    fn();
    expect(calls).toBe(0);
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

  test('calls func exactly once per burst', async () => {
    const spy = jest.fn();
    const fn = debounce(spy, 20);
    for (let i = 0; i < 10; i++) fn(i);
    await sleep(5);
    expect(spy).not.toHaveBeenCalled();
    await sleep(55);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(9);
  });

  test('forwards every argument of the latest call', async () => {
    const spy = jest.fn();
    const fn = debounce(spy, 10);
    fn(1);
    fn('x', { y: 2 }, [3]);
    await sleep(40);
    expect(spy).toHaveBeenCalledWith('x', { y: 2 }, [3]);
  });

  test('uses this from the latest call', async () => {
    const spy = jest.fn(function () {
      return this.id;
    });
    const fn = debounce(spy, 10);
    const a = { id: 'a', fn };
    const b = { id: 'b', fn };
    a.fn();
    b.fn();
    await sleep(40);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.results[0].value).toBe('b');
  });

  test('two separate bursts fire twice', async () => {
    const spy = jest.fn();
    const fn = debounce(spy, 15);
    fn('first');
    await sleep(45);
    fn('second');
    await sleep(45);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(1, 'first');
    expect(spy).toHaveBeenNthCalledWith(2, 'second');
  });

  test('separate debounced functions have independent timers', async () => {
    const spyA = jest.fn();
    const spyB = jest.fn();
    const a = debounce(spyA, 15);
    const b = debounce(spyB, 15);
    a('a');
    b('b');
    a('a2');
    await sleep(50);
    expect(spyA).toHaveBeenCalledTimes(1);
    expect(spyA).toHaveBeenCalledWith('a2');
    expect(spyB).toHaveBeenCalledTimes(1);
    expect(spyB).toHaveBeenCalledWith('b');
  });
});
