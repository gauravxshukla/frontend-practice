class Solution:
    def copyRandomList(self, head: Optional["Node"]) -> Optional["Node"]:
        # original -> copy; None maps to None so missing pointers copy as None
        copy_of = {None: None}
        # pass 1: make every copy first, so any random target already exists
        node = head
        while node:
            copy_of[node] = Node(node.val)
            node = node.next
        # pass 2: wire each copy to the copies of its original's neighbours
        node = head
        while node:
            copy_of[node].next = copy_of[node.next]
            copy_of[node].random = copy_of[node.random]
            node = node.next
        return copy_of[head]
