export default class History {
  #past = [];
  #present;
  #future = [];
  #limit;
  #batch = null; // { start, changed } while a batch is running

  constructor(initial, { limit = Infinity } = {}) {
    this.#present = initial;
    this.#limit = limit;
  }

  get() {
    return this.#present;
  }

  set(next) {
    if (this.#batch) {
      this.#batch.changed = true;
    } else {
      this.#record(this.#present);
    }
    this.#present = next;
    return next;
  }

  undo() {
    if (this.#past.length) {
      this.#future.push(this.#present);
      this.#present = this.#past.pop();
    }
    return this.#present;
  }

  redo() {
    if (this.#future.length) {
      this.#past.push(this.#present);
      this.#present = this.#future.pop();
    }
    return this.#present;
  }

  canUndo() {
    return this.#past.length > 0;
  }

  canRedo() {
    return this.#future.length > 0;
  }

  batch(fn) {
    if (this.#batch) {
      fn(); // Nested: part of the outer batch.
      return this.#present;
    }

    const batch = { start: this.#present, changed: false };
    this.#batch = batch;
    try {
      fn();
    } catch (error) {
      this.#present = batch.start;
      throw error;
    } finally {
      this.#batch = null;
    }

    if (batch.changed) this.#record(batch.start);
    return this.#present;
  }

  /** Pushes one undo step, trims to the limit and invalidates redo. */
  #record(value) {
    this.#past.push(value);
    while (this.#past.length > this.#limit) this.#past.shift();
    this.#future = [];
  }
}
