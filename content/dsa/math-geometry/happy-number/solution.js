/** Sum of the squares of the digits of x. */
function next(x) {
  let sum = 0;
  while (x > 0) {
    const d = x % 10;
    sum += d * d;
    x = Math.floor(x / 10);
  }
  return sum;
}

/**
 * Floyd's cycle detection: O(1) extra space.
 * @param {number} n
 * @return {boolean}
 */
export default function isHappy(n) {
  let slow = n;
  let fast = next(n);
  while (fast !== 1 && slow !== fast) {
    slow = next(slow);
    fast = next(next(fast));
  }
  return fast === 1;
}
