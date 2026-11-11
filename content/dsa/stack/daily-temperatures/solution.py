class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:
        answer = [0] * len(temperatures)  # 0 = no warmer day ahead
        stack = []  # indices still waiting for a warmer day; temps decrease upward
        for i, temp in enumerate(temperatures):
            # today is the first warmer day for every cooler day on the stack
            while stack and temp > temperatures[stack[-1]]:
                j = stack.pop()
                answer[j] = i - j
            stack.append(i)
        return answer
