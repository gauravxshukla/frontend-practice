---
title: Detect Squares
type: dsa
difficulty: medium
topic: math-geometry
order: 8
neetcode: true
tags: [design, hash-map, geometry, counting]
estimatedMinutes: 25
---

Build a `DetectSquares` class that collects points on a 2D grid and counts squares.

- `new DetectSquares()` starts with no points.
- `add(point)` stores `point = [x, y]`. Duplicate points are allowed, and each copy counts separately.
- `count(point)` takes a query point `[x, y]` (which is **not** added) and returns how many ways you can pick three stored points that, together with the query point, form an **axis-aligned square with positive area**.

Axis-aligned means the sides are parallel to the x and y axes. Choosing a different copy of a duplicate point counts as a different way.

```js
class DetectSquares {
  constructor()
  add(point)   // → void
  count(point) // → number
}
```

## Examples

```text
Input:  operations = ["DetectSquares","add","add","add","count","count","add","count"]
        arguments  = [[],[[3,10]],[[11,2]],[[3,2]],[[11,10]],[[14,8]],[[11,2]],[[11,10]]]
Output: [null,null,null,null,1,0,null,2]
Explanation: [11,10] with [3,10], [11,2], [3,2] is one square. [14,8] forms none. After adding a second [11,2], there are two ways.

Input:  operations = ["DetectSquares","add","add","add","add","count","count"]
        arguments  = [[],[[0,0]],[[0,1]],[[1,0]],[[1,1]],[[0,0]],[[2,2]]]
Output: [null,null,null,null,null,1,0]
Explanation: The unit square counts once from [0,0]. Nothing makes a square with [2,2].
```

## Constraints

- `point.length === 2`
- 0 ≤ x, y ≤ 1000
- At most 3000 calls to `add` and `count` in total

## Notes

- **Identify:** count axis-aligned squares using a query point → count points, then try each diagonal corner
- **Brute force:** try every triple of stored points with the query, O(n³) per count
- **Insight:** the diagonal corner fixes the whole square, so the other two corners are just lookups
- **Steps:** keep counts per point; for each stored point (px, py) with |px − x| = |py − y| > 0, add cnt(p) × cnt(x, py) × cnt(px, y)
- **Complexity:** O(n³) → O(n) per count, O(1) per add, O(n) space
- **Pitfall:** duplicate points each count, so multiply counts; a zero-size "square" (same point) is not allowed
- **Related:** Two Sum, Group Anagrams, Valid Sudoku
