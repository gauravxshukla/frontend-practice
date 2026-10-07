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

- **Key insight (greedy):** always run the task with the most copies left. The most frequent task is the bottleneck, and delaying it only creates idle slots later.
- **Heap simulation:** a max-heap of remaining counts plus a queue of `[count, readyTime]` for tasks in cooldown. Each tick, pop the top, decrement it, and park it in the queue until `time + n`. When the heap is empty, jump the clock to the queue's next ready time. O(T · log 26) ≈ O(T) time, O(26) space.
- **Math shortcut:** with `maxCount` = the highest frequency and `numMax` = how many letters share it, the answer is `max(tasks.length, (maxCount − 1) · (n + 1) + numMax)`. The frame is `maxCount − 1` blocks of size `n + 1` plus the final row. If there are more tasks than slots, there's no idling. O(T) time, O(1) space.
- Being able to explain *why* the formula works is what interviewers look for. The heap version is the safer one to code under pressure.
- Brute force: try every ordering, which is factorial and only useful to state.
- Pitfall: `n = 0` means no cooldown, so the answer is just `tasks.length`.
- Pitfall: forgetting `numMax`, i.e. ties for the highest frequency extend the last row.
- Follow-up: return the actual schedule, or handle tasks that must stay in a fixed order (simulate with a map of last-run times).
