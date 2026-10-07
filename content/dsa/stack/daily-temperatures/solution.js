/**
 * @param {number[]} temperatures
 * @return {number[]}
 */
export default function dailyTemperatures(temperatures) {
  const answer = new Array(temperatures.length).fill(0);
  const stack = []; // indices still waiting for a warmer day; temps non-increasing

  for (let i = 0; i < temperatures.length; i++) {
    // Today resolves every colder day on top of the stack.
    while (stack.length && temperatures[stack[stack.length - 1]] < temperatures[i]) {
      const j = stack.pop();
      answer[j] = i - j;
    }
    stack.push(i);
  }
  return answer;
}
