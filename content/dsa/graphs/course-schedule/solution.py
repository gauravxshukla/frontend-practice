class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        # prerequisite -> courses it unlocks, and how many prerequisites each course still needs
        unlocks = [[] for _ in range(numCourses)]
        needs = [0] * numCourses
        for course, pre in prerequisites:
            unlocks[pre].append(course)
            needs[course] += 1
        # courses with nothing left to wait for can be taken now
        ready = [c for c in range(numCourses) if needs[c] == 0]
        taken = 0
        while ready:
            course = ready.pop()
            taken += 1
            # taking it removes one requirement from each course it unlocks
            for nxt in unlocks[course]:
                needs[nxt] -= 1
                if needs[nxt] == 0:
                    ready.append(nxt)
        # courses on a cycle never reach zero requirements
        return taken == numCourses
