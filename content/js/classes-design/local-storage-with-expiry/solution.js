/** Default backing store: a minimal in-memory localStorage. */
class MemoryStorage {
  #data = new Map();

  getItem(key) {
    return this.#data.has(key) ? this.#data.get(key) : null;
  }

  setItem(key, value) {
    this.#data.set(key, String(value));
  }

  removeItem(key) {
    this.#data.delete(key);
  }
}

export default class ExpiringStorage {
  #storage;
  #now;

  constructor(storage = new MemoryStorage(), now = Date.now) {
    this.#storage = storage;
    this.#now = now;
  }

  setItem(key, value, ttlMs) {
    const expiresAt = ttlMs == null ? null : this.#now() + ttlMs;
    this.#storage.setItem(key, JSON.stringify({ value, expiresAt }));
  }

  getItem(key) {
    const raw = this.#storage.getItem(key);
    if (raw == null) return null;

    let entry;
    try {
      entry = JSON.parse(raw);
    } catch {
      return null;
    }
    if (entry === null || typeof entry !== 'object' || !('value' in entry)) return null;

    if (entry.expiresAt != null && this.#now() >= entry.expiresAt) {
      this.#storage.removeItem(key);
      return null;
    }
    return entry.value;
  }

  removeItem(key) {
    this.#storage.removeItem(key);
  }
}
