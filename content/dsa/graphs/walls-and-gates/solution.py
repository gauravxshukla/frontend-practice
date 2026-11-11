class Solution:
    def wallsAndGates(self, rooms: List[List[int]]) -> None:
        EMPTY = 2147483647
        rows, cols = len(rooms), len(rooms[0])
        # every gate starts the BFS together, so rooms are reached by their nearest gate first
        queue = deque((r, c) for r in range(rows) for c in range(cols) if rooms[r][c] == 0)
        while queue:
            r, c = queue.popleft()
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                # only unvisited empty rooms; walls and already-filled rooms stay as they are
                if nr < 0 or nr >= rows or nc < 0 or nc >= cols or rooms[nr][nc] != EMPTY:
                    continue
                rooms[nr][nc] = rooms[r][c] + 1
                queue.append((nr, nc))
