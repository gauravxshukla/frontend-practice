import myBind from './solution.js';

beforeAll(() => {
  Function.prototype.myBind = myBind;
});
afterAll(() => {
  delete Function.prototype.myBind;
});

function greet(greeting, punct) {
  return `${greeting}, ${this.name}${punct}`;
}

describe('Function.prototype.myBind', () => {
  test('example: fixes this and prepends bound arguments', () => {
    const hiAda = greet.myBind({ name: 'Ada' }, 'Hi');
    expect(hiAda('!')).toBe('Hi, Ada!');
  });

  test('example: the bound function can be called many times', () => {
    const hiAda = greet.myBind({ name: 'Ada' }, 'Hi');
    expect(hiAda('!')).toBe('Hi, Ada!');
    expect(hiAda('?')).toBe('Hi, Ada?');
  });

  test('returns a new function and does not call the target eagerly', () => {
    const spy = jest.fn();
    const bound = spy.myBind(null);
    expect(typeof bound).toBe('function');
    expect(bound).not.toBe(spy);
    expect(spy).not.toHaveBeenCalled();
  });

  test('bound args come before call args', () => {
    const spy = jest.fn();
    spy.myBind(null, 1, 2)(3, 4);
    expect(spy).toHaveBeenCalledWith(1, 2, 3, 4);
  });

  test('this cannot be overridden by calling it as a method', () => {
    function getName() {
      return this.name;
    }
    const bound = getName.myBind({ name: 'bound' });
    const other = { name: 'other', bound };
    expect(other.bound()).toBe('bound');
  });

  test('passes the return value through', () => {
    function make() {
      return { owner: this };
    }
    const ctx = {};
    expect(make.myBind(ctx)().owner).toBe(ctx);
  });

  test('with new, ignores thisArg and creates an instance of the target', () => {
    function Point(x, y) {
      this.x = x;
      this.y = y;
    }
    Point.prototype.sum = function () {
      return this.x + this.y;
    };
    const ctx = {};
    const BoundPoint = Point.myBind(ctx, 1);
    const p = new BoundPoint(2);
    expect(p).toBeInstanceOf(Point);
    expect(p).toBeInstanceOf(BoundPoint);
    expect(p.x).toBe(1);
    expect(p.y).toBe(2);
    expect(p.sum()).toBe(3);
    expect(ctx).toEqual({});
  });

  test('with new, an object returned by the constructor wins', () => {
    function Factory() {
      return { made: true };
    }
    const Bound = Factory.myBind({});
    expect(new Bound()).toEqual({ made: true });
  });

  test('works with class targets', () => {
    class Animal {
      constructor(kind, name) {
        this.kind = kind;
        this.name = name;
      }
    }
    const Dog = Animal.myBind(null, 'dog');
    const rex = new Dog('Rex');
    expect(rex).toBeInstanceOf(Animal);
    expect(rex.kind).toBe('dog');
    expect(rex.name).toBe('Rex');
  });

  test('throws a TypeError when not called on a function', () => {
    expect(() => myBind.call({}, null)).toThrow(TypeError);
  });
});
