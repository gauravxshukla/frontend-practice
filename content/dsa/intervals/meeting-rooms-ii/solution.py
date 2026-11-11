class Solution:
    def minMeetingRooms(self, intervals: List[List[int]]) -> int:
        # only the order of start and end times matters, not which meeting they belong to
        starts = sorted(iv[0] for iv in intervals)
        ends = sorted(iv[1] for iv in intervals)
        rooms = 0
        e = 0  # earliest end time not yet used to free a room
        for start in starts:
            # a meeting has already finished: reuse its room
            if start >= ends[e]:
                e += 1
            # every room is still busy: open a new one
            else:
                rooms += 1
        return rooms
