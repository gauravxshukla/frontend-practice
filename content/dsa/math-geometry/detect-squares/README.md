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

- **Key insight:** fix the query point `q`. Any square is determined by its **diagonal** corner `p`: once you know `p`, the other two corners are forced to be `(qx, py)` and `(px, qy)`.
- Store a count for each point (`Map` keyed by `"x,y"`) plus a list of distinct points.
- For `count(q)`: loop over stored points `p` with `|px − qx| === |py − qy|` and `px ≠ qx` (positive area). Add `cnt[p] · cnt[(qx, py)] · cnt[(px, qy)]`.
- `add` is O(1). `count` is O(number of distinct points) instead of O(n³) over all triples.
- Alternative: index points by x-coordinate and iterate only over points sharing the query's x, trying side length `|py − qy|` both left and right.
- Multiplying counts handles duplicates: two copies of one corner double the number of squares.
- Pitfall: forgetting the zero-area check (`p === q`), or only checking one diagonal direction.
- Pitfall: string keys like `x + y` collide (`1,23` vs `12,3`). Use a separator or `x * 1001 + y`.
- Follow-up: count rectangles instead of squares, or squares at any angle.
