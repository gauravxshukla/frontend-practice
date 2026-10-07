import History from './solution.js';

describe('History', () => {
  test('example: undo and redo walk through set values', () => {
    const h = new History('a');
    h.set('b');
    h.set('c');
    expect(h.undo()).toBe('b');
    expect(h.undo()).toBe('a');
    expect(h.redo()).toBe('b');
    expect(h.get()).toBe('b');
  });

  test('example: a batch of sets is one undo step', () => {
    const h = new History('c');
    h.batch(() => {
      h.set('d');
      h.set('e');
    });
    expect(h.get()).toBe('e');
    expect(h.undo()).toBe('c');
    expect(h.canUndo()).toBe(false);
    expect(h.redo()).toBe('e');
  });

  test('set returns the new value; get returns the initial value at first', () => {
    const h = new History(1);
    expect(h.get()).toBe(1);
    expect(h.set(2)).toBe(2);
    expect(h.get()).toBe(2);
  });

  test('canUndo and canRedo reflect the stacks', () => {
    const h = new History(0);
    expect(h.canUndo()).toBe(false);
    expect(h.canRedo()).toBe(false);
    h.set(1);
    expect(h.canUndo()).toBe(true);
    h.undo();
    expect(h.canUndo()).toBe(false);
    expect(h.canRedo()).toBe(true);
  });

  test('undo and redo with nothing to do are no-ops returning the current value', () => {
    const h = new History('x');
    expect(h.undo()).toBe('x');
    expect(h.redo()).toBe('x');
    h.set('y');
    expect(h.redo()).toBe('y');
    expect(h.get()).toBe('y');
  });

  test('set clears the redo stack', () => {
    const h = new History(1);
    h.set(2);
    h.set(3);
    h.undo();
    h.set(4);
    expect(h.canRedo()).toBe(false);
    expect(h.redo()).toBe(4);
    expect(h.undo()).toBe(2);
    expect(h.undo()).toBe(1);
  });

  test('limit keeps only the most recent undo steps', () => {
    const h = new History(0, { limit: 2 });
    h.set(1);
    h.set(2);
    h.set(3);
    expect(h.undo()).toBe(2);
    expect(h.undo()).toBe(1);
    expect(h.canUndo()).toBe(false);
    expect(h.undo()).toBe(1);
  });

  test('limit 0 disables undo', () => {
    const h = new History('a', { limit: 0 });
    h.set('b');
    expect(h.canUndo()).toBe(false);
    expect(h.undo()).toBe('b');
  });

  test('stores undefined, null and objects as-is', () => {
    const obj = { a: 1 };
    const h = new History(undefined);
    h.set(null);
    h.set(obj);
    expect(h.get()).toBe(obj);
    expect(h.undo()).toBeNull();
    expect(h.undo()).toBeUndefined();
    expect(h.canUndo()).toBe(false);
  });

  test('a batch clears redo, and a batch with no sets records nothing', () => {
    const h = new History(1);
    h.set(2);
    h.undo();
    h.batch(() => {});
    expect(h.canRedo()).toBe(true);
    expect(h.canUndo()).toBe(false);
    expect(h.batch(() => h.set(5))).toBe(5);
    expect(h.canRedo()).toBe(false);
    expect(h.undo()).toBe(1);
  });

  test('a throwing batch restores the value, records nothing and rethrows', () => {
    const h = new History('a');
    h.set('b');
    expect(() =>
      h.batch(() => {
        h.set('c');
        throw new Error('oops');
      }),
    ).toThrow('oops');
    expect(h.get()).toBe('b');
    expect(h.undo()).toBe('a');
    expect(h.canUndo()).toBe(false);
  });

  test('a nested batch belongs to the outer batch', () => {
    const h = new History(0);
    h.batch(() => {
      h.set(1);
      h.batch(() => h.set(2));
      h.set(3);
    });
    expect(h.undo()).toBe(0);
    expect(h.canUndo()).toBe(false);
  });

  test('instances are independent', () => {
    const a = new History('a');
    const b = new History('b');
    a.set('a2');
    expect(b.canUndo()).toBe(false);
    expect(b.get()).toBe('b');
  });
});
