class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        if (lists.length == 0) return null;
        List<ListNode> round = new ArrayList<>(Arrays.asList(lists));
        // merging in pairs halves the number of lists each round: log k rounds
        while (round.size() > 1) {
            List<ListNode> next = new ArrayList<>();
            for (int i = 0; i < round.size(); i += 2) {
                // an odd list out is carried to the next round unchanged
                next.add(i + 1 < round.size() ? mergeTwo(round.get(i), round.get(i + 1)) : round.get(i));
            }
            round = next;
        }
        return round.get(0);
    }

    // standard two-list merge, splicing the smaller head each time
    private ListNode mergeTwo(ListNode a, ListNode b) {
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        while (a != null && b != null) {
            if (a.val <= b.val) {
                tail.next = a;
                a = a.next;
            } else {
                tail.next = b;
                b = b.next;
            }
            tail = tail.next;
        }
        tail.next = a != null ? a : b;
        return dummy.next;
    }
}
