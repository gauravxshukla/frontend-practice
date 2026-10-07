/**
 * @typedef {{ val: number, next: RandomNode | null, random: RandomNode | null }} RandomNode
 * @param {RandomNode | null} head
 * @return {RandomNode | null} the head of a deep copy
 */
export default function copyRandomList(head) {
  // Pass 1: create a copy of every node, remembering original -> copy.
  const copyOf = new Map();
  for (let node = head; node; node = node.next) {
    copyOf.set(node, { val: node.val, next: null, random: null });
  }

  // Pass 2: wire next and random through the map.
  for (let node = head; node; node = node.next) {
    const copy = copyOf.get(node);
    copy.next = node.next ? copyOf.get(node.next) : null;
    copy.random = node.random ? copyOf.get(node.random) : null;
  }
  return head ? copyOf.get(head) : null;
}
