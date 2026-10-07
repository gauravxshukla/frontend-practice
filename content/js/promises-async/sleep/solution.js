/**
 * @param {number} ms
 * @return {Promise<void>}
 */
export default function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
