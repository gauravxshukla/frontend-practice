class Solution:
    def findOrder(self, numCourses: int, prerequisites: List[List[int]]) -> List[int]:
        # prerequisite -> courses it unlocks, and how many prerequisites each course still needs
        unlocks = [[] for _ in range(numCourses)]
        needs = [0] * numCourses
        for course, pre in prerequisites:
            unlocks[pre].append(course)
            needs[course] += 1
        # courses with nothing left to wait for can be taken now
        ready = [c for c in range(numCourses) if needs[c] == 0]
        order = []
        while ready:
            course = ready.pop()
            order.append(course)  # every prerequisite of this course is already in the order
            for nxt in unlocks[course]:
                needs[nxt] -= 1
                if needs[nxt] == 0:
                    ready.append(nxt)
        # a cycle leaves some courses out, and then no order exists
        return order if len(order) == numCourses else []
