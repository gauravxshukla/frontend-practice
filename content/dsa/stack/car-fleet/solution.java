class Solution {
    public int carFleet(int target, int[] position, int[] speed) {
        // cars closest to the target decide whether those behind can catch up
        Integer[] order = new Integer[position.length];
        for (int i = 0; i < order.length; i++) order[i] = i;
        Arrays.sort(order, (a, b) -> position[b] - position[a]);
        Deque<Double> fleets = new ArrayDeque<>(); // arrival time of each fleet, latest on top
        for (int i : order) {
            double time = (double) (target - position[i]) / speed[i];
            // slower to arrive than the fleet ahead means it can't catch it: a new fleet
            if (fleets.isEmpty() || time > fleets.peek()) fleets.push(time);
            // otherwise it catches up and moves at that fleet's pace
        }
        return fleets.size();
    }
}
