/**
 * @param {number} limit max allowed calls in any window
 * @param {number} windowMs window length in milliseconds
 * @return {() => boolean} tryAcquire
 */
export default function createRateLimiter(limit, windowMs) {
  // Timestamps of allowed calls, oldest first.
  const log = [];

  return function tryAcquire() {
    const now = Date.now();
    while (log.length > 0 && log[0] <= now - windowMs) log.shift();
    if (log.length >= limit) return false;
    log.push(now);
    return true;
  };
}
