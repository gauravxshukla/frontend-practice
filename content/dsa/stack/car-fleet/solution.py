class Solution:
    def carFleet(self, target: int, position: List[int], speed: List[int]) -> int:
        # cars closest to the target decide whether those behind can catch up
        cars = sorted(zip(position, speed), reverse=True)
        fleets = []  # arrival time of each fleet, nearest fleet first
        for p, s in cars:
            time = (target - p) / s
            # slower to arrive than the fleet ahead means it can't catch it: a new fleet
            if not fleets or time > fleets[-1]:
                fleets.append(time)
            # otherwise it catches up and moves at that fleet's pace
        return len(fleets)
