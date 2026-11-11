/**
 * @param {{ val: number, next: any } | null} head
 * @return {boolean}
 */
export default function hasCycle(head) {
  let slow = head;
  let fast = head;
  // fast reaching the end proves there is no loop
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    // inside a loop the faster pointer gains one step a turn, so they must meet
    if (slow === fast) return true;
  }
  return false;
}
