export default class TaskQueue {
  #concurrency;
  #queue = [];
  #running = 0;
  #idleWaiters = [];

  /**
   * @param {number} concurrency
   */
  constructor(concurrency) {
    this.#concurrency = concurrency;
  }

  /**
   * @param {() => Promise<any>} task
   * @return {Promise<any>}
   */
  add(task) {
    return new Promise((resolve, reject) => {
      this.#queue.push({ task, resolve, reject });
      this.#next();
    });
  }

  /** @return {number} tasks waiting to start */
  get pending() {
    return this.#queue.length;
  }

  /** @return {number} tasks currently running */
  get running() {
    return this.#running;
  }

  /** @return {Promise<void>} resolves when nothing is running or pending */
  onIdle() {
    if (this.#isIdle()) return Promise.resolve();
    return new Promise((resolve) => this.#idleWaiters.push(resolve));
  }

  #isIdle() {
    return this.#running === 0 && this.#queue.length === 0;
  }

  #next() {
    while (this.#running < this.#concurrency && this.#queue.length > 0) {
      const { task, resolve, reject } = this.#queue.shift();
      this.#running += 1;
      // then(task) turns a synchronous throw into a rejection of this task only.
      Promise.resolve()
        .then(task)
        .then(resolve, reject)
        .finally(() => {
          this.#running -= 1;
          this.#next();
          if (this.#isIdle()) {
            const waiters = this.#idleWaiters;
            this.#idleWaiters = [];
            waiters.forEach((resolveIdle) => resolveIdle());
          }
        });
    }
  }
}
