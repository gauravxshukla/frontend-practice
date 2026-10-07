import EventEmitter from './solution.js';

describe('EventEmitter', () => {
  test('example: emit calls listeners with the arguments and returns true', () => {
    const emitter = new EventEmitter();
    const listener = jest.fn();
    emitter.on('greet', listener);
    expect(emitter.emit('greet', 'Ada', 36)).toBe(true);
    expect(listener).toHaveBeenCalledWith('Ada', 36);
  });

  test('example: the function returned by on unsubscribes', () => {
    const emitter = new EventEmitter();
    const listener = jest.fn();
    const unsubscribe = emitter.on('greet', listener);
    unsubscribe();
    expect(emitter.emit('greet', 'Ada')).toBe(false);
    expect(listener).not.toHaveBeenCalled();
  });

  test('emit returns false when nobody is listening', () => {
    const emitter = new EventEmitter();
    expect(emitter.emit('nothing')).toBe(false);
  });

  test('calls listeners in registration order, with this set to the emitter', () => {
    const emitter = new EventEmitter();
    const calls = [];
    let seenThis;
    emitter.on('e', () => calls.push('a'));
    emitter.on('e', function () {
      seenThis = this;
      calls.push('b');
    });
    emitter.on('e', () => calls.push('c'));
    emitter.emit('e');
    expect(calls).toEqual(['a', 'b', 'c']);
    expect(seenThis).toBe(emitter);
  });

  test('the same listener registered twice is called twice', () => {
    const emitter = new EventEmitter();
    const listener = jest.fn();
    emitter.on('e', listener);
    emitter.on('e', listener);
    emitter.emit('e');
    expect(listener).toHaveBeenCalledTimes(2);
    expect(emitter.listenerCount('e')).toBe(2);
  });

  test('off removes only one registration of a duplicated listener, and returns this', () => {
    const emitter = new EventEmitter();
    const listener = jest.fn();
    emitter.on('e', listener);
    emitter.on('e', listener);
    expect(emitter.off('e', listener)).toBe(emitter);
    emitter.emit('e');
    expect(listener).toHaveBeenCalledTimes(1);
    expect(emitter.listenerCount('e')).toBe(1);
  });

  test('calling an unsubscribe function twice removes only its own registration', () => {
    const emitter = new EventEmitter();
    const listener = jest.fn();
    const unsubscribe = emitter.on('e', listener);
    emitter.on('e', listener);
    unsubscribe();
    unsubscribe();
    expect(emitter.listenerCount('e')).toBe(1);
  });

  test('off on an unknown event or listener is a no-op', () => {
    const emitter = new EventEmitter();
    const listener = jest.fn();
    emitter.on('e', listener);
    expect(() => emitter.off('missing', listener).off('e', () => {})).not.toThrow();
    emitter.emit('e');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  test('once runs a listener a single time and returns this', () => {
    const emitter = new EventEmitter();
    const listener = jest.fn();
    expect(emitter.once('e', listener)).toBe(emitter);
    emitter.emit('e', 1);
    emitter.emit('e', 2);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(1);
    expect(emitter.listenerCount('e')).toBe(0);
  });

  test('off removes a listener added with once', () => {
    const emitter = new EventEmitter();
    const listener = jest.fn();
    emitter.once('e', listener);
    emitter.off('e', listener);
    expect(emitter.emit('e')).toBe(false);
    expect(listener).not.toHaveBeenCalled();
  });

  test('a once listener that re-emits the same event runs only once', () => {
    const emitter = new EventEmitter();
    const listener = jest.fn(() => emitter.emit('e'));
    emitter.once('e', listener);
    emitter.emit('e');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  test('a listener removing itself during emit does not skip the next listener', () => {
    const emitter = new EventEmitter();
    const second = jest.fn();
    const unsubscribe = emitter.on('e', () => unsubscribe());
    emitter.on('e', second);
    emitter.emit('e');
    expect(second).toHaveBeenCalledTimes(1);
    expect(emitter.listenerCount('e')).toBe(1);
  });

  test('a listener added during emit is not called until the next emit', () => {
    const emitter = new EventEmitter();
    const late = jest.fn();
    emitter.once('e', () => emitter.on('e', late));
    emitter.emit('e');
    expect(late).not.toHaveBeenCalled();
    emitter.emit('e');
    expect(late).toHaveBeenCalledTimes(1);
  });

  test('a listener removed by an earlier listener still runs in the current emit', () => {
    const emitter = new EventEmitter();
    const second = jest.fn();
    emitter.on('e', () => emitter.off('e', second));
    emitter.on('e', second);
    emitter.emit('e');
    expect(second).toHaveBeenCalledTimes(1);
    emitter.emit('e');
    expect(second).toHaveBeenCalledTimes(1);
  });

  test('events and instances are independent', () => {
    const a = new EventEmitter();
    const b = new EventEmitter();
    const listener = jest.fn();
    a.on('x', listener);
    expect(a.emit('y')).toBe(false);
    expect(b.emit('x')).toBe(false);
    expect(listener).not.toHaveBeenCalled();
    expect(a.listenerCount('x')).toBe(1);
    expect(b.listenerCount('x')).toBe(0);
  });
});
