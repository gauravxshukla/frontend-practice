import myApply from './solution.js';

beforeAll(() => {
  Function.prototype.myApply = myApply;
});
afterAll(() => {
  delete Function.prototype.myApply;
});

function greet(greeting, punct) {
  return `${greeting}, ${this.name}${punct}`;
}

describe('Function.prototype.myApply', () => {
  test('example: sets this and spreads the arguments array', () => {
    expect(greet.myApply({ name: 'Ada' }, ['Hello', '!'])).toBe('Hello, Ada!');
  });

  test('example: works with built-ins like Math.max', () => {
    expect(Math.max.myApply(null, [3, 9, 4])).toBe(9);
  });

  test('null or undefined argsArray calls with no arguments', () => {
    function count(...args) {
      return args.length;
    }
    expect(count.myApply({}, null)).toBe(0);
    expect(count.myApply({}, undefined)).toBe(0);
    expect(count.myApply({})).toBe(0);
  });

  test('accepts array-like argsArray', () => {
    const spy = jest.fn();
    spy.myApply({}, { length: 2, 0: 'a', 1: 'b' });
    expect(spy).toHaveBeenCalledWith('a', 'b');
  });

  test('throws a TypeError for a primitive argsArray', () => {
    expect(() => greet.myApply({}, 5)).toThrow(TypeError);
    expect(() => greet.myApply({}, 'ab')).toThrow(TypeError);
  });

  test('null and undefined thisArg become globalThis', () => {
    function getThis() {
      return this;
    }
    expect(getThis.myApply(null, [])).toBe(globalThis);
    expect(getThis.myApply(undefined)).toBe(globalThis);
  });

  test('primitive thisArg is boxed', () => {
    function describeThis() {
      return [typeof this, this.valueOf()];
    }
    expect(describeThis.myApply(7, [])).toEqual(['object', 7]);
  });

  test('cleans up the temporary key, even on throw', () => {
    const obj = { fn: 1 };
    function boom() {
      throw new Error('boom');
    }
    function ok() {
      return this.fn;
    }
    expect(ok.myApply(obj, [])).toBe(1);
    expect(() => boom.myApply(obj, [])).toThrow('boom');
    expect(Reflect.ownKeys(obj)).toEqual(['fn']);
  });

  test('passes holes as undefined', () => {
    const spy = jest.fn();
    // eslint-disable-next-line no-sparse-arrays
    spy.myApply(null, [1, , 3]);
    expect(spy).toHaveBeenCalledWith(1, undefined, 3);
  });
});
