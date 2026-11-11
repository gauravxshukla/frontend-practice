/**
 * @typedef {{ val: number, next: ListNode | null }} ListNode
 * @param {(ListNode | null)[]} lists
 * @return {ListNode | null}
 */
export default function mergeKLists(lists) {
  // standard two-list merge, splicing the smaller head each time
  const mergeTwo = (a, b) => {
    const dummy = { val: 0, next: null };
    let tail = dummy;
    while (a && b) {
      if (a.val <= b.val) {
        tail.next = a;
        a = a.next;
      } else {
        tail.next = b;
        b = b.next;
      }
      tail = tail.next;
    }
    tail.next = a ?? b;
    return dummy.next;
  };

  if (lists.length === 0) return null;
  let round = lists;
  // merging in pairs halves the number of lists each round: log k rounds
  while (round.length > 1) {
    const next = [];
    for (let i = 0; i < round.length; i += 2) {
      // an odd list out is carried to the next round unchanged
      next.push(i + 1 < round.length ? mergeTwo(round[i], round[i + 1]) : round[i]);
    }
    round = next;
  }
  return round[0];
}
