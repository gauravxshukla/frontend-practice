class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        int[] answer = new int[temperatures.length]; // 0 = no warmer day ahead
        Deque<Integer> stack = new ArrayDeque<>(); // indices still waiting for a warmer day; temps decrease upward
        for (int i = 0; i < temperatures.length; i++) {
            // today is the first warmer day for every cooler day on the stack
            while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {
                int j = stack.pop();
                answer[j] = i - j;
            }
            stack.push(i);
        }
        return answer;
    }
}
