/**
 * @param {number[]} heights
 * @return {number}
 */
export default function largestRectangleArea(heights) {
  const stack = []; // indices with increasing heights
  let best = 0;

  // The extra iteration with height 0 flushes everything left on the stack.
  for (let i = 0; i <= heights.length; i++) {
    const h = i === heights.length ? 0 : heights[i];
    while (stack.length && heights[stack[stack.length - 1]] >= h) {
      const height = heights[stack.pop()];
      // The bar extends right up to i - 1 and left to just after the new stack top.
      const left = stack.length ? stack[stack.length - 1] + 1 : 0;
      best = Math.max(best, height * (i - left));
    }
    stack.push(i);
  }
  return best;
}
