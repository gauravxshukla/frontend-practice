/**
 * @param {number[]} temperatures
 * @return {number[]}
 */
export default function dailyTemperatures(temperatures) {
  const answer = new Array(temperatures.length).fill(0); // 0 = no warmer day ahead
  const stack = []; // indices still waiting for a warmer day; temps decrease upward
  for (let i = 0; i < temperatures.length; i++) {
    // today is the first warmer day for every cooler day on the stack
    while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      const j = stack.pop();
      answer[j] = i - j;
    }
    stack.push(i);
  }
  return answer;
}
