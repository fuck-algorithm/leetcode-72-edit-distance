import type { Language } from '../types';

export const codeTemplates: Record<Language, string> = {
  java: `class Solution {
    public int minDistance(String word1, String word2) {
        int n1 = word1.length();
        int n2 = word2.length();
        int[][] dp = new int[n1 + 1][n2 + 1];
        // 初始化第一行
        for (int j = 1; j <= n2; j++) {
            dp[0][j] = dp[0][j - 1] + 1;
        }
        // 初始化第一列
        for (int i = 1; i <= n1; i++) {
            dp[i][0] = dp[i - 1][0] + 1;
        }
        // 填充DP表格
        for (int i = 1; i <= n1; i++) {
            for (int j = 1; j <= n2; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.min(dp[i][j - 1], 
                               Math.min(dp[i - 1][j], dp[i - 1][j - 1])) + 1;
                }
            }
        }
        return dp[n1][n2];
    }
}`,

  python: `class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        n1 = len(word1)
        n2 = len(word2)
        dp = [[0] * (n2 + 1) for _ in range(n1 + 1)]
        # 初始化第一行
        for j in range(1, n2 + 1):
            dp[0][j] = dp[0][j - 1] + 1
        # 初始化第一列
        for i in range(1, n1 + 1):
            dp[i][0] = dp[i - 1][0] + 1
        # 填充DP表格
        for i in range(1, n1 + 1):
            for j in range(1, n2 + 1):
                if word1[i - 1] == word2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1]
                else:
                    dp[i][j] = min(dp[i][j - 1], dp[i - 1][j], 
                                   dp[i - 1][j - 1]) + 1
        return dp[-1][-1]`,

  golang: `func minDistance(word1 string, word2 string) int {
    n1 := len(word1)
    n2 := len(word2)
    dp := make([][]int, n1+1)
    for i := range dp {
        dp[i] = make([]int, n2+1)
    }
    // 初始化第一行
    for j := 1; j <= n2; j++ {
        dp[0][j] = dp[0][j-1] + 1
    }
    // 初始化第一列
    for i := 1; i <= n1; i++ {
        dp[i][0] = dp[i-1][0] + 1
    }
    // 填充DP表格
    for i := 1; i <= n1; i++ {
        for j := 1; j <= n2; j++ {
            if word1[i-1] == word2[j-1] {
                dp[i][j] = dp[i-1][j-1]
            } else {
                dp[i][j] = min(dp[i][j-1], dp[i-1][j], dp[i-1][j-1]) + 1
            }
        }
    }
    return dp[n1][n2]
}`,

  javascript: `var minDistance = function(word1, word2) {
    const n1 = word1.length;
    const n2 = word2.length;
    const dp = Array(n1 + 1).fill(null).map(() => Array(n2 + 1).fill(0));
    // 初始化第一行
    for (let j = 1; j <= n2; j++) {
        dp[0][j] = dp[0][j - 1] + 1;
    }
    // 初始化第一列
    for (let i = 1; i <= n1; i++) {
        dp[i][0] = dp[i - 1][0] + 1;
    }
    // 填充DP表格
    for (let i = 1; i <= n1; i++) {
        for (let j = 1; j <= n2; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.min(dp[i][j - 1], 
                           Math.min(dp[i - 1][j], dp[i - 1][j - 1])) + 1;
            }
        }
    }
    return dp[n1][n2];
};`
};

export const languageNames: Record<Language, string> = {
  java: 'Java',
  python: 'Python',
  golang: 'Go',
  javascript: 'JavaScript'
};
