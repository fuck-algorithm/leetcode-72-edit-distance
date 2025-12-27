import React, { useState } from 'react';
import '../styles/Modal.css';

interface Props {
  onClose: () => void;
}

const AlgorithmIdeaModal: React.FC<Props> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'intro' | 'dp' | 'example' | 'formula'>('intro');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content algorithm-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">📚 编辑距离 - 算法思路详解</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        {/* 标签页导航 */}
        <div className="modal-tabs">
          <button 
            className={`modal-tab ${activeTab === 'intro' ? 'active' : ''}`}
            onClick={() => setActiveTab('intro')}
          >
            🎯 什么是编辑距离
          </button>
          <button 
            className={`modal-tab ${activeTab === 'dp' ? 'active' : ''}`}
            onClick={() => setActiveTab('dp')}
          >
            💡 动态规划思路
          </button>
          <button 
            className={`modal-tab ${activeTab === 'example' ? 'active' : ''}`}
            onClick={() => setActiveTab('example')}
          >
            📝 图解示例
          </button>
          <button 
            className={`modal-tab ${activeTab === 'formula' ? 'active' : ''}`}
            onClick={() => setActiveTab('formula')}
          >
            📐 公式总结
          </button>
        </div>

        <div className="modal-body">
          {activeTab === 'intro' && <IntroSection />}
          {activeTab === 'dp' && <DPSection />}
          {activeTab === 'example' && <ExampleSection />}
          {activeTab === 'formula' && <FormulaSection />}
        </div>
      </div>
    </div>
  );
};

// 介绍部分
const IntroSection: React.FC = () => (
  <div className="algorithm-idea">
    <div className="idea-card highlight-card">
      <div className="card-icon">🤔</div>
      <div className="card-content">
        <h3>生活中的编辑距离</h3>
        <p>
          想象你在用手机打字，不小心把 <strong>"horse"</strong> 打成了 <strong>"ros"</strong>，
          你需要通过<span className="highlight-text">插入</span>、<span className="highlight-text">删除</span>、
          <span className="highlight-text">替换</span>这三种操作来修正它。
          <strong>最少需要几步？</strong>这就是编辑距离要解决的问题！
        </p>
      </div>
    </div>

    <h3>📋 问题定义</h3>
    <div className="definition-box">
      <p>
        给定两个字符串 <code>word1</code> 和 <code>word2</code>，
        计算将 <code>word1</code> 转换成 <code>word2</code> 所需的<strong>最少操作数</strong>。
      </p>
    </div>

    <h3>🔧 三种操作</h3>
    <div className="operations-grid">
      <div className="operation-card insert-card">
        <div className="op-icon">➕</div>
        <div className="op-name">插入</div>
        <div className="op-desc">在任意位置插入一个字符</div>
        <div className="op-example">
          <span className="before">ab</span>
          <span className="arrow">→</span>
          <span className="after">a<span className="highlight-insert">c</span>b</span>
        </div>
      </div>
      <div className="operation-card delete-card">
        <div className="op-icon">🗑️</div>
        <div className="op-name">删除</div>
        <div className="op-desc">删除任意位置的一个字符</div>
        <div className="op-example">
          <span className="before">a<span className="highlight-delete">b</span>c</span>
          <span className="arrow">→</span>
          <span className="after">ac</span>
        </div>
      </div>
      <div className="operation-card replace-card">
        <div className="op-icon">🔄</div>
        <div className="op-name">替换</div>
        <div className="op-desc">将一个字符替换为另一个</div>
        <div className="op-example">
          <span className="before">a<span className="highlight-replace">b</span>c</span>
          <span className="arrow">→</span>
          <span className="after">a<span className="highlight-replace">x</span>c</span>
        </div>
      </div>
    </div>

    <h3>💼 实际应用场景</h3>
    <div className="applications-list">
      <div className="app-item">
        <span className="app-icon">📝</span>
        <span className="app-text"><strong>拼写检查</strong>：自动纠正拼写错误</span>
      </div>
      <div className="app-item">
        <span className="app-icon">🧬</span>
        <span className="app-text"><strong>DNA序列比对</strong>：分析基因相似度</span>
      </div>
      <div className="app-item">
        <span className="app-icon">🔍</span>
        <span className="app-text"><strong>模糊搜索</strong>：搜索引擎的"您是不是要找..."</span>
      </div>
      <div className="app-item">
        <span className="app-icon">📄</span>
        <span className="app-text"><strong>文本比较</strong>：Git diff 等版本控制工具</span>
      </div>
    </div>
  </div>
);

// 动态规划思路部分
const DPSection: React.FC = () => (
  <div className="algorithm-idea">
    <div className="idea-card">
      <div className="card-icon">💡</div>
      <div className="card-content">
        <h3>核心思想：分而治之</h3>
        <p>
          把大问题拆成小问题！要把整个 word1 变成 word2，
          我们可以先考虑：<strong>如果只看最后一个字符，应该怎么处理？</strong>
        </p>
      </div>
    </div>

    <h3>📊 定义状态</h3>
    <div className="state-definition">
      <div className="state-box">
        <code className="state-code">dp[i][j]</code>
        <span className="state-equals">=</span>
        <span className="state-meaning">
          将 word1 的<strong>前 i 个字符</strong>转换成 word2 的<strong>前 j 个字符</strong>所需的最少操作数
        </span>
      </div>
    </div>

    <h3>🎯 两种情况分析</h3>
    
    <div className="case-analysis">
      <div className="case-card case-match">
        <div className="case-header">
          <span className="case-icon">✅</span>
          <span className="case-title">情况一：最后一个字符相同</span>
        </div>
        <div className="case-condition">
          <code>word1[i-1] == word2[j-1]</code>
        </div>
        <div className="case-explanation">
          <p>太好了！最后一个字符已经相同，<strong>不需要任何操作</strong>！</p>
          <p>问题简化为：把 word1 的前 i-1 个字符变成 word2 的前 j-1 个字符</p>
        </div>
        <div className="case-formula">
          <code>dp[i][j] = dp[i-1][j-1]</code>
        </div>
      </div>

      <div className="case-card case-diff">
        <div className="case-header">
          <span className="case-icon">❌</span>
          <span className="case-title">情况二：最后一个字符不同</span>
        </div>
        <div className="case-condition">
          <code>word1[i-1] != word2[j-1]</code>
        </div>
        <div className="case-explanation">
          <p>需要做一次操作！有三种选择，我们选<strong>代价最小</strong>的：</p>
        </div>
        <div className="three-choices">
          <div className="choice-item">
            <div className="choice-op">
              <span className="choice-icon insert-icon">←</span>
              <span className="choice-name">插入</span>
            </div>
            <div className="choice-desc">在 word1 末尾插入 word2[j-1]</div>
            <code className="choice-formula">dp[i][j-1] + 1</code>
          </div>
          <div className="choice-item">
            <div className="choice-op">
              <span className="choice-icon delete-icon">↑</span>
              <span className="choice-name">删除</span>
            </div>
            <div className="choice-desc">删除 word1 的最后一个字符</div>
            <code className="choice-formula">dp[i-1][j] + 1</code>
          </div>
          <div className="choice-item">
            <div className="choice-op">
              <span className="choice-icon replace-icon">↖</span>
              <span className="choice-name">替换</span>
            </div>
            <div className="choice-desc">把 word1[i-1] 替换成 word2[j-1]</div>
            <code className="choice-formula">dp[i-1][j-1] + 1</code>
          </div>
        </div>
      </div>
    </div>

    <h3>🚀 边界条件</h3>
    <div className="boundary-conditions">
      <div className="boundary-item">
        <code>dp[i][0] = i</code>
        <span className="boundary-explain">word2 为空，需要删除 word1 的所有 i 个字符</span>
      </div>
      <div className="boundary-item">
        <code>dp[0][j] = j</code>
        <span className="boundary-explain">word1 为空，需要插入 word2 的所有 j 个字符</span>
      </div>
    </div>
  </div>
);

// 图解示例部分
const ExampleSection: React.FC = () => (
  <div className="algorithm-idea">
    <h3>📝 经典示例：horse → ros</h3>
    
    <div className="example-intro">
      <p>让我们一步步看看如何将 <code>"horse"</code> 转换为 <code>"ros"</code>：</p>
    </div>

    <div className="step-by-step">
      <div className="step-item">
        <div className="step-number">1</div>
        <div className="step-content">
          <div className="step-operation replace-op">替换</div>
          <div className="step-detail">
            <span className="word-before"><span className="char-highlight">h</span>orse</span>
            <span className="step-arrow">→</span>
            <span className="word-after"><span className="char-highlight">r</span>orse</span>
          </div>
          <div className="step-explain">把 'h' 替换成 'r'</div>
        </div>
      </div>

      <div className="step-item">
        <div className="step-number">2</div>
        <div className="step-content">
          <div className="step-operation delete-op">删除</div>
          <div className="step-detail">
            <span className="word-before">r<span className="char-highlight">o</span>rse</span>
            <span className="step-arrow">→</span>
            <span className="word-after">rrse</span>
          </div>
          <div className="step-explain">删除 'o'（等等，这样不对...）</div>
        </div>
      </div>
    </div>

    <div className="correct-solution">
      <h4>✨ 正确的最优解（3步）</h4>
      <div className="solution-steps">
        <div className="sol-step">
          <span className="sol-num">①</span>
          <span className="sol-op replace-tag">替换</span>
          <span className="sol-detail">horse → <strong>r</strong>orse（h→r）</span>
        </div>
        <div className="sol-step">
          <span className="sol-num">②</span>
          <span className="sol-op delete-tag">删除</span>
          <span className="sol-detail">rorse → rose（删除r）</span>
        </div>
        <div className="sol-step">
          <span className="sol-num">③</span>
          <span className="sol-op delete-tag">删除</span>
          <span className="sol-detail">rose → ros（删除e）</span>
        </div>
      </div>
    </div>

    <h3>📊 DP表格填充过程</h3>
    <div className="dp-table-demo">
      <table className="demo-table">
        <thead>
          <tr>
            <th></th>
            <th className="header-cell">""</th>
            <th className="header-cell">r</th>
            <th className="header-cell">o</th>
            <th className="header-cell">s</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th className="header-cell">""</th>
            <td className="init-cell">0</td>
            <td className="init-cell">1</td>
            <td className="init-cell">2</td>
            <td className="init-cell">3</td>
          </tr>
          <tr>
            <th className="header-cell">h</th>
            <td className="init-cell">1</td>
            <td className="calc-cell">1</td>
            <td className="calc-cell">2</td>
            <td className="calc-cell">3</td>
          </tr>
          <tr>
            <th className="header-cell">o</th>
            <td className="init-cell">2</td>
            <td className="calc-cell">2</td>
            <td className="match-cell">1</td>
            <td className="calc-cell">2</td>
          </tr>
          <tr>
            <th className="header-cell">r</th>
            <td className="init-cell">3</td>
            <td className="match-cell">2</td>
            <td className="calc-cell">2</td>
            <td className="calc-cell">2</td>
          </tr>
          <tr>
            <th className="header-cell">s</th>
            <td className="init-cell">4</td>
            <td className="calc-cell">3</td>
            <td className="calc-cell">3</td>
            <td className="match-cell">2</td>
          </tr>
          <tr>
            <th className="header-cell">e</th>
            <td className="init-cell">5</td>
            <td className="calc-cell">4</td>
            <td className="calc-cell">4</td>
            <td className="result-cell">3</td>
          </tr>
        </tbody>
      </table>
      <div className="table-legend">
        <span className="legend-item"><span className="legend-color init"></span>初始化</span>
        <span className="legend-item"><span className="legend-color match"></span>字符匹配</span>
        <span className="legend-item"><span className="legend-color calc"></span>计算得出</span>
        <span className="legend-item"><span className="legend-color result"></span>最终答案</span>
      </div>
    </div>

    <div className="reading-tip">
      <div className="tip-icon">💡</div>
      <div className="tip-content">
        <strong>如何读懂这个表格？</strong>
        <p>表格中的每个格子 dp[i][j] 表示：把 word1 的前 i 个字符变成 word2 的前 j 个字符需要的最少操作数。</p>
        <p>右下角的 <strong>3</strong> 就是最终答案：horse → ros 最少需要 3 次操作。</p>
      </div>
    </div>
  </div>
);

// 公式总结部分
const FormulaSection: React.FC = () => (
  <div className="algorithm-idea">
    <h3>📐 状态转移方程</h3>
    
    <div className="formula-box main-formula">
      <div className="formula-case">
        <div className="formula-condition">当 word1[i-1] == word2[j-1] 时：</div>
        <div className="formula-equation">
          <code>dp[i][j] = dp[i-1][j-1]</code>
        </div>
      </div>
      <div className="formula-case">
        <div className="formula-condition">当 word1[i-1] != word2[j-1] 时：</div>
        <div className="formula-equation">
          <code>dp[i][j] = min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1]) + 1</code>
        </div>
      </div>
    </div>

    <h3>🎯 三种操作对应关系</h3>
    <div className="operation-mapping">
      <div className="mapping-item">
        <div className="mapping-direction">
          <span className="dir-arrow">↖</span>
          <code>dp[i-1][j-1]</code>
        </div>
        <div className="mapping-op replace-tag">替换</div>
        <div className="mapping-explain">把 word1[i-1] 替换成 word2[j-1]</div>
      </div>
      <div className="mapping-item">
        <div className="mapping-direction">
          <span className="dir-arrow">↑</span>
          <code>dp[i-1][j]</code>
        </div>
        <div className="mapping-op delete-tag">删除</div>
        <div className="mapping-explain">删除 word1[i-1]</div>
      </div>
      <div className="mapping-item">
        <div className="mapping-direction">
          <span className="dir-arrow">←</span>
          <code>dp[i][j-1]</code>
        </div>
        <div className="mapping-op insert-tag">插入</div>
        <div className="mapping-explain">在 word1 末尾插入 word2[j-1]</div>
      </div>
    </div>

    <h3>⏱️ 复杂度分析</h3>
    <div className="complexity-box">
      <div className="complexity-item">
        <span className="complexity-label">时间复杂度</span>
        <code className="complexity-value">O(m × n)</code>
        <span className="complexity-note">m、n 分别是两个字符串的长度</span>
      </div>
      <div className="complexity-item">
        <span className="complexity-label">空间复杂度</span>
        <code className="complexity-value">O(m × n)</code>
        <span className="complexity-note">可优化到 O(min(m, n))</span>
      </div>
    </div>

    <h3>🔑 记忆口诀</h3>
    <div className="memory-tips">
      <div className="tip-card">
        <div className="tip-title">🎵 方向口诀</div>
        <div className="tip-verse">
          <p>左边来的是<strong>插入</strong>，</p>
          <p>上边来的是<strong>删除</strong>，</p>
          <p>斜角来的是<strong>替换</strong>，</p>
          <p>三者取小加上一。</p>
        </div>
      </div>
      <div className="tip-card">
        <div className="tip-title">💭 理解技巧</div>
        <div className="tip-verse">
          <p>• 插入：word1 不变，word2 少考虑一个字符</p>
          <p>• 删除：word1 少考虑一个字符，word2 不变</p>
          <p>• 替换：两边都少考虑一个字符</p>
        </div>
      </div>
    </div>

    <div className="final-summary">
      <h4>📌 总结</h4>
      <p>
        编辑距离是一个经典的动态规划问题，核心思想是<strong>将大问题分解为小问题</strong>。
        通过比较两个字符串的最后一个字符，我们可以将问题规模缩小，
        最终通过填表的方式得到答案。
      </p>
    </div>
  </div>
);

export default AlgorithmIdeaModal;
