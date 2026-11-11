class Solution:
    def plusOne(self, digits: List[int]) -> List[int]:
        result = digits[:]
        for i in range(len(result) - 1, -1, -1):
            # no carry past a digit below 9, so we're done
            if result[i] < 9:
                result[i] += 1
                return result
            # 9 + 1 = 10: write 0 and carry left
            result[i] = 0
        # every digit was 9, so the number gains a leading 1
        return [1] + result
