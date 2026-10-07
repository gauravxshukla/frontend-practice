const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * @param {() => Promise<any>} fn
 * @param {{ retries?: number, delay?: number }} [options]
 * @return {Promise<any>}
 */
export default async function retry(fn, { retries = 0, delay = 0 } = {}) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0 && delay > 0) await sleep(delay);
    try {
      // `return await` so a rejection is caught here rather than escaping.
      return await fn();
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}
