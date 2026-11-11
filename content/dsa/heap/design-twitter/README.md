---
title: Design Twitter
type: dsa
difficulty: medium
topic: heap
order: 6
neetcode: true
tags: [design, heap, hash-map, k-way-merge]
estimatedMinutes: 30
---

Design a tiny social feed, a `Twitter` class with these methods:

- `new Twitter()` creates an empty service.
- `postTweet(userId, tweetId)` publishes a new tweet with id `tweetId` by `userId`. Every `tweetId` is unique, and each call is newer than all earlier ones.
- `getNewsFeed(userId)` returns the ids of the **10 most recent** tweets posted by `userId` or by anyone `userId` follows, ordered **newest first**. Return fewer if fewer exist.
- `follow(followerId, followeeId)` makes `followerId` follow `followeeId`.
- `unfollow(followerId, followeeId)` undoes that. Unfollowing someone you don't follow does nothing.

A user always sees their own tweets, and following yourself has no effect.

```js
class Twitter {
  postTweet(userId, tweetId)        // → void
  getNewsFeed(userId)               // → number[]
  follow(followerId, followeeId)    // → void
  unfollow(followerId, followeeId)  // → void
}
```

## Examples

The judge calls the methods in order. `operations[i]` is called with `arguments[i]`, and the output lists each call's return value (`null` for the constructor and for void methods).

```text
Input:
  operations = ["Twitter","postTweet","getNewsFeed","follow","postTweet","getNewsFeed","unfollow","getNewsFeed"]
  arguments  = [[],[1,5],[1],[1,2],[2,6],[1],[1,2],[1]]
Output: [null,null,[5],null,null,[6,5],null,[5]]

Input:
  operations = ["Twitter","postTweet","postTweet","getNewsFeed","getNewsFeed"]
  arguments  = [[],[1,10],[2,20],[2],[3]]
Output: [null,null,null,[20],[]]
```

## Constraints

- 1 ≤ `userId`, `followerId`, `followeeId` ≤ 500
- 0 ≤ `tweetId` ≤ 10⁴
- At most 3 · 10⁴ calls in total.

## Notes

- **Identify:** 10 most recent tweets across followed users → merge per-user timelines with a max-heap
- **Brute force:** gather every tweet of every followee, sort by time, take 10, O(T log T)
- **Insight:** each user's tweets are already in time order, so a heap merges only their newest ones
- **Steps:** tweets get a global time; feed pushes each followee's latest tweet, pops 10 times, pushing that user's previous tweet
- **Complexity:** getNewsFeed O(T log T) → O(f + 10 log f) for f followees; O(1) post/follow
- **Pitfall:** users always see their own tweets, and unfollowing yourself must not hide them
- **Related:** Merge k Sorted Lists, K Closest Points to Origin, LRU Cache
