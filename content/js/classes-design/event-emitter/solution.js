export default class EventEmitter {
  #events = new Map(); // name -> [{ listener, once }]

  on(name, listener) {
    const registration = { listener, once: false };
    this.#add(name, registration);
    return () => this.#remove(name, registration);
  }

  once(name, listener) {
    this.#add(name, { listener, once: true });
    return this;
  }

  off(name, listener) {
    const list = this.#events.get(name);
    if (!list) return this;
    // Remove only the most recent registration of this listener.
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i].listener === listener) {
        this.#remove(name, list[i]);
        break;
      }
    }
    return this;
  }

  emit(name, ...args) {
    const list = this.#events.get(name);
    if (!list) return false;
    // Snapshot, so listeners that add/remove listeners don't affect this emit.
    for (const registration of list.slice()) {
      if (registration.once) this.#remove(name, registration);
      registration.listener.apply(this, args);
    }
    return true;
  }

  listenerCount(name) {
    return this.#events.get(name)?.length ?? 0;
  }

  #add(name, registration) {
    if (!this.#events.has(name)) this.#events.set(name, []);
    this.#events.get(name).push(registration);
  }

  #remove(name, registration) {
    const list = this.#events.get(name);
    const index = list ? list.indexOf(registration) : -1;
    if (index === -1) return;
    list.splice(index, 1);
    if (list.length === 0) this.#events.delete(name);
  }
}
