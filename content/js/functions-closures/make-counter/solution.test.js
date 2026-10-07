import makeCounter from './solution.js';

describe('makeCounter', () => {
  test('example: increment and decrement return the new value', () => {
    const counter = makeCounter(5);
    expect(counter.get()).toBe(5);
    expect(counter.increment()).toBe(6);
    expect(counter.increment()).toBe(7);
    expect(counter.decrement()).toBe(6);
    expect(counter.get()).toBe(6);
  });

  test('example: reset restores the initial value', () => {
    const counter = makeCounter(5);
    counter.increment();
    counter.increment();
    expect(counter.reset()).toBe(5);
    expect(counter.get()).toBe(5);
  });

  test('defaults to 0', () => {
    const counter = makeCounter();
    expect(counter.get()).toBe(0);
    expect(counter.increment()).toBe(1);
  });

  test('can go below zero', () => {
    const counter = makeCounter();
    expect(counter.decrement()).toBe(-1);
    expect(counter.decrement()).toBe(-2);
  });

  test('get does not change the value', () => {
    const counter = makeCounter(3);
    counter.get();
    counter.get();
    expect(counter.get()).toBe(3);
  });

  test('counters are independent', () => {
    const a = makeCounter();
    const b = makeCounter(10);
    a.increment();
    a.increment();
    b.decrement();
    expect(a.get()).toBe(2);
    expect(b.get()).toBe(9);
    a.reset();
    expect(b.get()).toBe(9);
  });

  test('counting continues normally after reset', () => {
    const counter = makeCounter(1);
    counter.increment();
    counter.reset();
    expect(counter.increment()).toBe(2);
  });

  test('methods work when destructured', () => {
    const { increment, get } = makeCounter(0);
    increment();
    increment();
    expect(get()).toBe(2);
  });

  test('state is private (not exposed as a property)', () => {
    const counter = makeCounter(7);
    expect(Object.keys(counter).sort()).toEqual(['decrement', 'get', 'increment', 'reset']);
  });
});
