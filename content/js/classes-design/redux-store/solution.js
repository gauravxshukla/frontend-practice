const isPlainObject = (value) => {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
};

/**
 * @param {(state: any, action: { type: any }) => any} reducer
 * @param {any} [preloadedState]
 */
export default function createStore(reducer, preloadedState) {
  if (typeof reducer !== 'function') throw new TypeError('Expected the reducer to be a function.');

  let state = preloadedState;
  let listeners = []; // [{ listener }], one entry per subscription
  let isDispatching = false;

  function getState() {
    return state;
  }

  function dispatch(action) {
    if (!isPlainObject(action)) throw new TypeError('Actions must be plain objects.');
    if (action.type === undefined) throw new TypeError('Actions must have a "type" property.');
    if (isDispatching) throw new Error('Reducers may not dispatch actions.');

    try {
      isDispatching = true;
      state = reducer(state, action);
    } finally {
      isDispatching = false;
    }

    // Snapshot: (un)subscribing inside a listener only affects the next dispatch.
    for (const entry of listeners.slice()) entry.listener();
    return action;
  }

  function subscribe(listener) {
    if (typeof listener !== 'function') throw new TypeError('Expected the listener to be a function.');
    const entry = { listener };
    listeners.push(entry);
    return function unsubscribe() {
      listeners = listeners.filter((e) => e !== entry);
    };
  }

  dispatch({ type: '@@INIT' });
  return { getState, dispatch, subscribe };
}
