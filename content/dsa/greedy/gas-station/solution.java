class Solution {
    public int canCompleteCircuit(int[] gas, int[] cost) {
        int total = 0; // net gas over the whole loop
        int tank = 0; // net gas since the current candidate start
        int start = 0;
        for (int i = 0; i < gas.length; i++) {
            total += gas[i] - cost[i];
            tank += gas[i] - cost[i];
            // ran dry: no station from start to i can work, so try the next one
            if (tank < 0) {
                start = i + 1;
                tank = 0;
            }
        }
        // enough gas overall means the surviving start can also finish the wrap-around
        return total >= 0 ? start : -1;
    }
}
