/**
 * @param {number[][]} heights
 * @return {number[][]} cells [r, c] that can drain into both oceans (any order)
 */
export default function pacificAtlantic(heights) {
  const rows = heights.length;
  const cols = rows ? heights[0].length : 0;
  if (!rows || !cols) return [];

  // Walk "uphill" from each ocean's border: a cell is reachable if water could flow
  // from it down to the ocean.
  const climb = (starts) => {
    const seen = Array.from({ length: rows }, () => new Array(cols).fill(false));
    const stack = [];
    for (const [r, c] of starts) {
      if (!seen[r][c]) {
        seen[r][c] = true;
        stack.push([r, c]);
      }
    }
    while (stack.length) {
      const [r, c] = stack.pop();
      for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nr = r + dr;
        const nc = c + dc;
        if (
          nr >= 0 && nc >= 0 && nr < rows && nc < cols &&
          !seen[nr][nc] && heights[nr][nc] >= heights[r][c]
        ) {
          seen[nr][nc] = true;
          stack.push([nr, nc]);
        }
      }
    }
    return seen;
  };

  const pacificStarts = [];
  const atlanticStarts = [];
  for (let r = 0; r < rows; r++) {
    pacificStarts.push([r, 0]);
    atlanticStarts.push([r, cols - 1]);
  }
  for (let c = 0; c < cols; c++) {
    pacificStarts.push([0, c]);
    atlanticStarts.push([rows - 1, c]);
  }

  const pacific = climb(pacificStarts);
  const atlantic = climb(atlanticStarts);
  const result = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (pacific[r][c] && atlantic[r][c]) result.push([r, c]);
    }
  }
  return result;
}
