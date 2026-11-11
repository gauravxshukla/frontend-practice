class Solution:
    def multiply(self, num1: str, num2: str) -> str:
        m, n = len(num1), len(num2)
        # the product has at most m + n digits
        out = [0] * (m + n)
        for i in range(m - 1, -1, -1):
            for j in range(n - 1, -1, -1):
                # digits i and j contribute to positions i + j (carry) and i + j + 1 (units)
                total = int(num1[i]) * int(num2[j]) + out[i + j + 1]
                out[i + j + 1] = total % 10
                out[i + j] += total // 10
        # drop leading zeros, but keep one digit so 0 stays "0"
        start = 0
        while start < len(out) - 1 and out[start] == 0:
            start += 1
        return "".join(str(d) for d in out[start:])
