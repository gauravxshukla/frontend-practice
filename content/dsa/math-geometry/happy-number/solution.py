class Solution:
    def isHappy(self, n: int) -> bool:
        # the next number in the sequence: sum of the squares of the digits
        def nxt(x: int) -> int:
            total = 0
            while x > 0:
                d = x % 10
                total += d * d
                x //= 10
            return total

        # the sequence must loop eventually; fast and slow pointers find that loop
        slow, fast = nxt(n), nxt(nxt(n))
        while slow != fast:
            slow = nxt(slow)
            fast = nxt(nxt(fast))
        # 1 loops back to itself, so meeting at 1 means happy
        return slow == 1
