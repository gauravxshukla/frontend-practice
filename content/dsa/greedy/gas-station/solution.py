class Solution:
    def canCompleteCircuit(self, gas: List[int], cost: List[int]) -> int:
        total = 0  # net gas over the whole loop
        tank = 0  # net gas since the current candidate start
        start = 0
        for i in range(len(gas)):
            total += gas[i] - cost[i]
            tank += gas[i] - cost[i]
            # ran dry: no station from start to i can work, so try the next one
            if tank < 0:
                start = i + 1
                tank = 0
        # enough gas overall means the surviving start can also finish the wrap-around
        return start if total >= 0 else -1
