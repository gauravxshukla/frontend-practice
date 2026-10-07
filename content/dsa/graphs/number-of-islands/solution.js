/**
 * @param {string[][]} grid  "1" = land, "0" = water
 * @return {number}
 */
export default function numIslands(grid) {
  const rows = grid.length;
  const cols = rows ? grid[0].length : 0;
  let islands = 0;

  // Iterative flood fill so a huge island can't overflow the call stack.
  const sink = (r, c) => {
    const stack = [[r, c]];
    grid[r][c] = '0';
    while (stack.length) {
      const [i, j] = stack.pop();
      for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const ni = i + di;
        const nj = j + dj;
        if (ni >= 0 && nj >= 0 && ni < rows && nj < cols && grid[ni][nj] === '1') {
          grid[ni][nj] = '0'; // mark when pushed, so each cell enters the stack once
          stack.push([ni, nj]);
        }
      }
    }
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        islands++;
        sink(r, c);
      }
    }
  }
  return islands;
}
