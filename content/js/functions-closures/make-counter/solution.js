/**
 * @param {number} [initial=0]
 * @return {{ get: () => number, increment: () => number, decrement: () => number, reset: () => number }}
 */
export default function makeCounter(initial = 0) {
  let value = initial;

  return {
    get: () => value,
    increment: () => ++value,
    decrement: () => --value,
    reset: () => (value = initial),
  };
}
