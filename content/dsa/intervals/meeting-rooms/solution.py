class Solution:
    def canAttendMeetings(self, intervals: List[List[int]]) -> bool:
        # sorted by start, only neighbours can overlap
        ordered = sorted(intervals, key=lambda iv: iv[0])
        for i in range(1, len(ordered)):
            # starting before the previous meeting ends is a clash (ending exactly then is fine)
            if ordered[i][0] < ordered[i - 1][1]:
                return False
        return True
