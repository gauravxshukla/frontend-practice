/**
 * @param {() => Promise<Record<string, boolean>>} fetchFlags
 */
export default function createFeatureFlags(fetchFlags) {
  let cache = null; // last successfully fetched flags
  let pending = null; // in-flight fetch, shared by concurrent callers

  function load() {
    const request = Promise.resolve()
      .then(() => fetchFlags())
      .then(
        (flags) => {
          // Ignore a response that a newer refresh has superseded.
          if (pending === request) {
            cache = flags ?? {};
            pending = null;
          }
          return flags;
        },
        (error) => {
          if (pending === request) pending = null; // allow a retry
          throw error;
        },
      );
    pending = request;
    return request;
  }

  async function getFlags() {
    if (pending) {
      try {
        return await pending;
      } catch (error) {
        if (cache) return cache;
        throw error;
      }
    }
    return cache ?? load();
  }

  async function isEnabled(name, fallback = false) {
    try {
      const flags = await getFlags();
      return flags && Object.hasOwn(flags, name) ? flags[name] : fallback;
    } catch {
      return fallback;
    }
  }

  function refresh() {
    return load();
  }

  return { isEnabled, refresh };
}
