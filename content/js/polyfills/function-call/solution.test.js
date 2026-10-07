import myCall from './solution.js';

beforeAll(() => {
  Function.prototype.myCall = myCall;
});
afterAll(() => {
  delete Function.prototype.myCall;
});

function greet(greeting, punct) {
  return `${greeting}, ${this.name}${punct}`;
}

describe('Function.prototype.myCall', () => {
  test('example: sets this and forwards arguments', () => {
    expect(greet.myCall({ name: 'Ada' }, 'Hello', '!')).toBe('Hello, Ada!');
  });

  test('example: passes the return value through', () => {
    function sum(a, b) {
      return { total: a + b + this.base };
    }
    expect(sum.myCall({ base: 10 }, 1, 2)).toEqual({ total: 13 });
  });

  test('forwards every argument, including none', () => {
    const spy = jest.fn();
    spy.myCall({}, 1, 'two', null);
    expect(spy).toHaveBeenCalledWith(1, 'two', null);
    function count(...args) {
      return args.length;
    }
    expect(count.myCall({})).toBe(0);
  });

  test('null and undefined thisArg become globalThis', () => {
    function getThis() {
      return this;
    }
    const symbolsBefore = Object.getOwnPropertySymbols(globalThis).length;
    expect(getThis.myCall(null)).toBe(globalThis);
    expect(getThis.myCall(undefined)).toBe(globalThis);
    expect(Object.getOwnPropertySymbols(globalThis).length).toBe(symbolsBefore);
  });

  test('primitive thisArg is boxed', () => {
    function describeThis() {
      return [typeof this, this.valueOf()];
    }
    expect(describeThis.myCall(5)).toEqual(['object', 5]);
    expect(describeThis.myCall('hi')).toEqual(['object', 'hi']);
    expect(describeThis.myCall(true)).toEqual(['object', true]);
  });

  test('does not clobber existing properties', () => {
    const obj = {
      fn: 'keep me',
      read() {
        return 'method';
      },
    };
    function readFn() {
      return this.fn;
    }
    expect(readFn.myCall(obj)).toBe('keep me');
    expect(obj.fn).toBe('keep me');
    expect(obj.read()).toBe('method');
  });

  test('cleans up the temporary key', () => {
    const obj = { a: 1 };
    function keysSeen() {
      return Reflect.ownKeys(this).length;
    }
    keysSeen.myCall(obj);
    expect(Reflect.ownKeys(obj)).toEqual(['a']);
  });

  test('cleans up even when the function throws', () => {
    const obj = {};
    function boom() {
      throw new Error('boom');
    }
    expect(() => boom.myCall(obj)).toThrow('boom');
    expect(Reflect.ownKeys(obj)).toEqual([]);
  });

  test('works for methods borrowed from other objects', () => {
    const arrayLike = { 0: 'a', 1: 'b', length: 2 };
    expect(Array.prototype.join.myCall(arrayLike, '-')).toBe('a-b');
  });
});
