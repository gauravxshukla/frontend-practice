/**
 * @typedef {{ val: number, next: RandomNode | null, random: RandomNode | null }} RandomNode
 * @param {RandomNode | null} head
 * @return {RandomNode | null} the head of a deep copy
 */
export default function copyRandomList(head) {
  // original -> copy; null maps to null so missing pointers copy as null
  const copyOf = new Map([[null, null]]);
  // pass 1: make every copy first, so any random target already exists
  for (let node = head; node; node = node.next) {
    copyOf.set(node, { val: node.val, next: null, random: null });
  }
  // pass 2: wire each copy to the copies of its original's neighbours
  for (let node = head; node; node = node.next) {
    copyOf.get(node).next = copyOf.get(node.next);
    copyOf.get(node).random = copyOf.get(node.random);
  }
  return copyOf.get(head);
}
