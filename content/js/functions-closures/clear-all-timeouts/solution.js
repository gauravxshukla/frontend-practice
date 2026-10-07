/**
 * @return {{
 *   setTimeout: (fn: Function, ms?: number, ...args: any[]) => any,
 *   clearTimeout: (id: any) => void,
 *   clearAllTimeouts: () => void,
 * }}
 */
export default function createTimeoutRegistry() {
  const pending = new Set();

  return {
    setTimeout(fn, ms, ...args) {
      const id = globalThis.setTimeout(() => {
        pending.delete(id);
        fn(...args);
      }, ms);
      pending.add(id);
      return id;
    },

    clearTimeout(id) {
      pending.delete(id);
      globalThis.clearTimeout(id);
    },

    clearAllTimeouts() {
      for (const id of pending) globalThis.clearTimeout(id);
      pending.clear();
    },
  };
}
