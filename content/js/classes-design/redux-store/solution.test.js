import createStore from './solution.js';

const counter = (state = 0, action) => {
  switch (action.type) {
    case 'inc':
      return state + 1;
    case 'add':
      return state + action.amount;
    default:
      return state;
  }
};

describe('createStore', () => {
  test('example: the reducer default state applies on creation', () => {
    const store = createStore(counter);
    expect(store.getState()).toBe(0);
  });

  test('example: dispatch updates state, notifies listeners and returns the action', () => {
    const store = createStore(counter);
    const listener = jest.fn(() => store.getState());
    store.subscribe(listener);
    const action = { type: 'inc' };
    expect(store.dispatch(action)).toBe(action);
    expect(store.getState()).toBe(1);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.results[0].value).toBe(1);
  });

  test('dispatches @@INIT on creation and respects preloadedState', () => {
    const reducer = jest.fn((state = 'default') => state);
    const store = createStore(reducer, 'preloaded');
    expect(reducer).toHaveBeenCalledTimes(1);
    expect(reducer).toHaveBeenCalledWith('preloaded', { type: '@@INIT' });
    expect(store.getState()).toBe('preloaded');
  });

  test('passes the current state and the action to the reducer', () => {
    const store = createStore(counter, 10);
    store.dispatch({ type: 'add', amount: 5 });
    store.dispatch({ type: 'unknown' });
    expect(store.getState()).toBe(15);
  });

  test.each([
    ['null', null],
    ['an array', [{ type: 'inc' }]],
    ['a function', () => ({ type: 'inc' })],
    ['a string', 'inc'],
    ['a class instance', new (class Action { type = 'inc'; })()],
    ['an object without a type', { payload: 1 }],
  ])('dispatch throws for %s', (_, action) => {
    const store = createStore(counter);
    expect(() => store.dispatch(action)).toThrow();
    expect(store.getState()).toBe(0);
  });

  test('accepts an action with a null prototype', () => {
    const store = createStore(counter);
    const action = Object.assign(Object.create(null), { type: 'inc' });
    expect(store.dispatch(action)).toBe(action);
    expect(store.getState()).toBe(1);
  });

  test('throws when the reducer dispatches, and stays usable afterwards', () => {
    let store;
    const reducer = (state = 0, action) => {
      if (action.type === 'nested') store.dispatch({ type: 'inc' });
      return action.type === 'inc' ? state + 1 : state;
    };
    store = createStore(reducer);
    expect(() => store.dispatch({ type: 'nested' })).toThrow();
    store.dispatch({ type: 'inc' });
    expect(store.getState()).toBe(1);
  });

  test('unsubscribe stops notifications and is safe to call twice', () => {
    const store = createStore(counter);
    const a = jest.fn();
    const b = jest.fn();
    const unsubscribeA = store.subscribe(a);
    store.subscribe(b);
    unsubscribeA();
    unsubscribeA();
    store.dispatch({ type: 'inc' });
    expect(a).not.toHaveBeenCalled();
    expect(b).toHaveBeenCalledTimes(1);
  });

  test('the same listener subscribed twice is called twice and unsubscribed independently', () => {
    const store = createStore(counter);
    const listener = jest.fn();
    const first = store.subscribe(listener);
    store.subscribe(listener);
    store.dispatch({ type: 'inc' });
    expect(listener).toHaveBeenCalledTimes(2);
    first();
    store.dispatch({ type: 'inc' });
    expect(listener).toHaveBeenCalledTimes(3);
  });

  test('a listener unsubscribing during dispatch does not skip the others', () => {
    const store = createStore(counter);
    const calls = [];
    const unsubscribeA = store.subscribe(() => {
      calls.push('a');
      unsubscribeA();
    });
    store.subscribe(() => calls.push('b'));
    store.subscribe(() => calls.push('c'));
    store.dispatch({ type: 'inc' });
    store.dispatch({ type: 'inc' });
    expect(calls).toEqual(['a', 'b', 'c', 'b', 'c']);
  });

  test('changes to subscriptions during a dispatch apply from the next dispatch', () => {
    const store = createStore(counter);
    const late = jest.fn();
    const removed = jest.fn();
    let unsubscribeRemoved;
    store.subscribe(() => {
      if (store.getState() === 1) {
        store.subscribe(late);
        unsubscribeRemoved();
      }
    });
    unsubscribeRemoved = store.subscribe(removed);
    store.dispatch({ type: 'inc' });
    expect(late).not.toHaveBeenCalled();
    expect(removed).toHaveBeenCalledTimes(1);
    store.dispatch({ type: 'inc' });
    expect(late).toHaveBeenCalledTimes(1);
    expect(removed).toHaveBeenCalledTimes(1);
  });

  test('stores are independent', () => {
    const a = createStore(counter);
    const b = createStore(counter);
    a.dispatch({ type: 'inc' });
    expect(a.getState()).toBe(1);
    expect(b.getState()).toBe(0);
  });

  test('throws if the reducer is not a function', () => {
    expect(() => createStore(null)).toThrow();
  });
});
