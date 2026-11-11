/**
 * @param {number[][]} heights
 * @return {number[][]}
 */
export default function pacificAtlantic(heights) {
  const rows = heights.length;
  const cols = heights[0].length;
  const pacific = Array.from({ length: rows }, () => new Array(cols).fill(false));
  const atlantic = Array.from({ length: rows }, () => new Array(cols).fill(false));
  // climb from the ocean: a neighbour at least as high can drain into this cell
  const climb = (r, c, seen) => {
    seen[r][c] = true;
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || seen[nr][nc]) continue;
      if (heights[nr][nc] >= heights[r][c]) climb(nr, nc, seen);
    }
  };
  // top/left edges touch the Pacific, bottom/right edges the Atlantic
  for (let r = 0; r < rows; r++) {
    climb(r, 0, pacific);
    climb(r, cols - 1, atlantic);
  }
  for (let c = 0; c < cols; c++) {
    climb(0, c, pacific);
    climb(rows - 1, c, atlantic);
  }
  const result = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) if (pacific[r][c] && atlantic[r][c]) result.push([r, c]);
  }
  return result;
}
