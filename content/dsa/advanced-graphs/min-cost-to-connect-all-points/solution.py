class Solution:
    def minCostConnectPoints(self, points: List[List[int]]) -> int:
        n = len(points)
        in_tree = [False] * n
        # cheapest known edge from the growing tree to each outside point
        best = [float("inf")] * n
        best[0] = 0  # start the tree at point 0
        total = 0
        for _ in range(n):
            # the closest outside point joins next (Prim's greedy step)
            u = -1
            for i in range(n):
                if not in_tree[i] and (u == -1 or best[i] < best[u]):
                    u = i
            in_tree[u] = True
            total += best[u]
            # the new tree point may offer a cheaper link to the remaining points
            for v in range(n):
                if in_tree[v]:
                    continue
                cost = abs(points[u][0] - points[v][0]) + abs(points[u][1] - points[v][1])
                if cost < best[v]:
                    best[v] = cost
        return total
