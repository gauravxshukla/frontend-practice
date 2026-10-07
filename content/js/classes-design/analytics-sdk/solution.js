export default class Analytics {
  #send;
  #batchSize;
  #flushInterval;
  #buffer = [];
  #timer = null;
  #queue = Promise.resolve(true); // serialises flushes
  #destroyed = false;

  constructor({ send, batchSize = 5, flushInterval = 50 }) {
    this.#send = send;
    this.#batchSize = batchSize;
    this.#flushInterval = flushInterval;
  }

  track(event, props = {}) {
    if (this.#destroyed) return;
    this.#buffer.push({ event, props });
    if (this.#buffer.length >= this.#batchSize) {
      this.flush();
    } else if (this.#timer === null) {
      this.#timer = setTimeout(() => this.flush(), this.#flushInterval);
    }
  }

  flush() {
    this.#clearTimer();
    this.#queue = this.#queue.then(() => this.#drain());
    return this.#queue;
  }

  destroy() {
    this.#destroyed = true;
    this.#clearTimer();
  }

  async #drain() {
    while (this.#buffer.length) {
      const batch = this.#buffer.splice(0, this.#batchSize);
      try {
        await this.#send(batch);
      } catch {
        // Put the batch back in front of anything tracked meanwhile.
        this.#buffer.unshift(...batch);
        return false;
      }
    }
    return true;
  }

  #clearTimer() {
    clearTimeout(this.#timer);
    this.#timer = null;
  }
}
