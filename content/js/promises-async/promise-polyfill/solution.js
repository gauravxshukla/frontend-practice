const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

export default class MyPromise {
  #state = PENDING;
  #value = undefined;
  #handlers = [];

  /**
   * @param {(resolve: (value: any) => void, reject: (reason: any) => void) => void} executor
   */
  constructor(executor) {
    if (typeof executor !== 'function') throw new TypeError('MyPromise executor is not a function');
    const { resolve, reject } = this.#onceResolvers();
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  /**
   * @param {(value: any) => any} [onFulfilled]
   * @param {(reason: any) => any} [onRejected]
   * @return {MyPromise}
   */
  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const handler = { onFulfilled, onRejected, resolve, reject };
      if (this.#state === PENDING) this.#handlers.push(handler);
      else this.#schedule(handler);
    });
  }

  /**
   * @param {(reason: any) => any} [onRejected]
   * @return {MyPromise}
   */
  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  /**
   * @param {() => any} [onFinally]
   * @return {MyPromise}
   */
  finally(onFinally) {
    if (typeof onFinally !== 'function') return this.then();
    return this.then(
      (value) => MyPromise.resolve(onFinally()).then(() => value),
      (reason) =>
        MyPromise.resolve(onFinally()).then(() => {
          throw reason;
        }),
    );
  }

  /** @return {MyPromise} */
  static resolve(value) {
    if (value instanceof MyPromise) return value;
    return new MyPromise((resolve) => resolve(value));
  }

  /** @return {MyPromise} */
  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason));
  }

  /** A resolve/reject pair where only the first call of either one has any effect. */
  #onceResolvers() {
    let called = false;
    return {
      resolve: (value) => {
        if (called) return;
        called = true;
        this.#resolveWith(value);
      },
      reject: (reason) => {
        if (called) return;
        called = true;
        this.#settle(REJECTED, reason);
      },
    };
  }

  /** The Promises/A+ resolution procedure: adopt thenables, fulfil with anything else. */
  #resolveWith(value) {
    if (value === this) {
      this.#settle(REJECTED, new TypeError('Chaining cycle detected for promise'));
      return;
    }
    if (value !== null && (typeof value === 'object' || typeof value === 'function')) {
      let then;
      try {
        then = value.then; // Read once: it may be a throwing getter.
      } catch (error) {
        this.#settle(REJECTED, error);
        return;
      }
      if (typeof then === 'function') {
        // A fresh once-only pair: a misbehaving thenable may call both, or call one and then throw.
        const { resolve, reject } = this.#onceResolvers();
        try {
          then.call(value, resolve, reject);
        } catch (error) {
          reject(error);
        }
        return;
      }
    }
    this.#settle(FULFILLED, value);
  }

  #settle(state, value) {
    if (this.#state !== PENDING) return;
    this.#state = state;
    this.#value = value;
    this.#handlers.forEach((handler) => this.#schedule(handler));
    this.#handlers = [];
  }

  #schedule({ onFulfilled, onRejected, resolve, reject }) {
    queueMicrotask(() => {
      const fulfilled = this.#state === FULFILLED;
      const callback = fulfilled ? onFulfilled : onRejected;
      if (typeof callback !== 'function') {
        // Pass the outcome straight through to the child promise.
        (fulfilled ? resolve : reject)(this.#value);
        return;
      }
      try {
        resolve(callback(this.#value));
      } catch (error) {
        reject(error);
      }
    });
  }
}
