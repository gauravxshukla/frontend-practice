class Solution {
    public String multiply(String num1, String num2) {
        int m = num1.length();
        int n = num2.length();
        // the product has at most m + n digits
        int[] out = new int[m + n];
        for (int i = m - 1; i >= 0; i--) {
            for (int j = n - 1; j >= 0; j--) {
                // digits i and j contribute to positions i + j (carry) and i + j + 1 (units)
                int sum = (num1.charAt(i) - '0') * (num2.charAt(j) - '0') + out[i + j + 1];
                out[i + j + 1] = sum % 10;
                out[i + j] += sum / 10;
            }
        }
        // drop leading zeros, but keep one digit so 0 stays "0"
        int start = 0;
        while (start < out.length - 1 && out[start] == 0) start++;
        StringBuilder sb = new StringBuilder();
        for (int k = start; k < out.length; k++) sb.append(out[k]);
        return sb.toString();
    }
}
