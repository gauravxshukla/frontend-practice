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

- **Key insight:** each user's tweets are already in time order, so building a feed is a **k-way merge** of the newest ends of k sorted lists, stopping after 10.
- State: a global counter for timestamps, `Map<user, [time, tweetId][]>`, and `Map<user, Set<followee>>`.
- `getNewsFeed`: push the newest tweet of the user and each followee into a max-heap keyed by time. Pop up to 10 times, and after each pop push that author's next-older tweet.
- Complexity: post/follow/unfollow are O(1). The feed is O(f + 10 · log f) for f followees.
- Brute force: gather every tweet from every relevant user, sort them by time, and take 10. O(T log T), which is simple and fine for small data.
- Pitfall: forgetting to include the user's own tweets, or letting a self-follow / self-unfollow hide them.
- Pitfall: using the tweet id as the timestamp. Ids aren't guaranteed to increase.
- Follow-ups: fan-out-on-write vs fan-out-on-read for celebrities, pagination, and sharding by user.
