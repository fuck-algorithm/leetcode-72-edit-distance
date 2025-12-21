import React from 'react';
import '../styles/Modal.css';

interface Props {
  onClose: () => void;
}

const AlgorithmIdeaModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">编辑距离 - 算法思路</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="algorithm-idea">
            <h3>问题描述</h3>
            <p>
              给定两个单词 word1 和 word2，计算将 word1 转换成 word2 所需的最少操作数。
              允许的操作有三种：插入一个字符、删除一个字符、替换一个字符。
            </p>

            <h3>动态规划思路</h3>
            <p>
              定义 <code>dp[i][j]</code> 表示将 word1 的前 i 个字符转换成 word2 的前 j 个字符所需的最少操作数。
            </p>

            <h3>状态转移方程</h3>
            <ul>
              <li>
                当 <code>word1[i-1] == word2[j-1]</code> 时，字符相同，不需要操作：
                <div className="formula">dp[i][j] = dp[i-1][j-1]</div>
              </li>
              <li>
                当 <code>word1[i-1] != word2[j-1]</code> 时，取三种操作的最小值：
                <div className="formula">dp[i][j] = min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1]) + 1</div>
                <ul>
                  <li><code>dp[i-1][j-1] + 1</code>：替换操作，将 word1[i-1] 替换为 word2[j-1]</li>
                  <li><code>dp[i-1][j] + 1</code>：删除操作，删除 word1[i-1]</li>
                  <li><code>dp[i][j-1] + 1</code>：插入操作，在 word1 中插入 word2[j-1]</li>
                </ul>
              </li>
            </ul>

            <h3>边界条件</h3>
            <ul>
              <li><code>dp[i][0] = i</code>：word2 为空，需要删除 word1 的所有字符</li>
              <li><code>dp[0][j] = j</code>：word1 为空，需要插入 word2 的所有字符</li>
            </ul>

            <h3>时间复杂度</h3>
            <p>O(m × n)，其中 m 和 n 分别是两个字符串的长度。</p>

            <h3>空间复杂度</h3>
            <p>O(m × n)，用于存储 DP 表格。可以优化到 O(min(m, n))。</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmIdeaModal;
