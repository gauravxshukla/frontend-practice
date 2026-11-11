/**
 * @param {number} n
 * @return {boolean}
 */
export default function isHappy(n) {
  // the next number in the sequence: sum of the squares of the digits
  const next = (x) => {
    let sum = 0;
    while (x > 0) {
      const d = x % 10;
      sum += d * d;
      x = Math.floor(x / 10);
    }
    return sum;
  };
  // the sequence must loop eventually; fast and slow pointers find that loop
  let slow = next(n);
  let fast = next(next(n));
  while (slow !== fast) {
    slow = next(slow);
    fast = next(next(fast));
  }
  // 1 loops back to itself, so meeting at 1 means happy
  return slow === 1;
}
