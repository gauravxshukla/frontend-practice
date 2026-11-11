---
title: Task Scheduler
type: dsa
difficulty: medium
topic: heap
order: 5
neetcode: true
tags: [heap, greedy, counting, queue]
estimatedMinutes: 25
---

A CPU has to run a list of `tasks`, each labelled with a capital letter. Each time unit, the CPU either runs one task or sits idle. Tasks can run in any order, but two runs of the **same** label must be at least `n` time units apart (so there are at least `n` other units, busy or idle, between them).

Return the minimum number of time units needed to finish every task.

```js
function leastInterval(tasks, n) // → number
```

## Examples

```text
Input:  tasks = ["A","A","A","B","B","B"], n = 2
Output: 8
Explanation: A → B → idle → A → B → idle → A → B.

Input:  tasks = ["A","C","A","B","D","B"], n = 1
Output: 6
Explanation: A → B → C → D → A → B, with no idling needed.

Input:  tasks = ["A","A","A","B","B","B"], n = 3
Output: 10
```

## Constraints

- 1 ≤ `tasks.length` ≤ 10⁴
- Each task is an uppercase English letter.
- 0 ≤ `n` ≤ 100

## Notes

- **Identify:** same task needs n idle slots between runs, minimise total time → the most frequent task sets the frame
- **Key formula:** time = max(tasks, (maxCount − 1) × (n + 1) + tasksWithMaxCount)
- **Brute force:** simulate time step by step, always running the available task with most left
- **Better:** max-heap + cooldown queue simulation, O(total time · log 26)
- **Insight:** lay out the most frequent task with gaps; other tasks fill the gaps, or there are no idles at all
- **Steps:** count tasks; find maxCount and how many tasks share it; apply the formula
- **Complexity:** simulation O(time · log 26) → O(n) time, O(26) space
- **Pitfall:** when gaps overflow, the answer is just the task count, hence the max with tasks.length
- **Related:** Last Stone Weight, Hand of Straights, Partition Labels
