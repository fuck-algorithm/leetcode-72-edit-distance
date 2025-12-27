import type { AlgorithmStep } from '../types';

// 生成编辑距离算法的所有步骤
export const generateEditDistanceSteps = (word1: string, word2: string): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  const n1 = word1.length;
  const n2 = word2.length;
  
  // 初始化DP表格
  const dp: number[][] = Array(n1 + 1).fill(null).map(() => Array(n2 + 1).fill(0));
  
  let stepId = 0;

  // 步骤0: 初始化说明
  steps.push({
    id: stepId++,
    description: `🚀 开始计算编辑距离\n将 "${word1 || '(空)'}" 转换为 "${word2 || '(空)'}"\n创建 ${n1 + 1}×${n2 + 1} 的DP表格`,
    detailDescription: `【核心思想】我们用动态规划来解决这个问题。

📌 dp[i][j] 的含义：
将 word1 的前 i 个字符转换为 word2 的前 j 个字符所需的最小操作数。

🤔 为什么表格是 ${n1 + 1}×${n2 + 1}？
因为我们需要考虑"空字符串"的情况，所以行数和列数都要 +1。
第 0 行表示 word1 为空串，第 0 列表示 word2 为空串。`,
    i: -1,
    j: -1,
    dpTable: JSON.parse(JSON.stringify(dp)),
    highlightCells: [],
    operation: 'init',
    codeLines: { java: [3, 4], python: [2, 3], golang: [3, 4], javascript: [2, 3] },
    variables: [
      { name: 'n1', value: n1, line: 2 },
      { name: 'n2', value: n2, line: 3 },
    ],
  });

  // 初始化第一行
  for (let j = 1; j <= n2; j++) {
    dp[0][j] = dp[0][j - 1] + 1;
    steps.push({
      id: stepId++,
      description: `📝 初始化第一行 dp[0][${j}] = ${dp[0][j]}`,
      detailDescription: `【为什么这样初始化？】
空字符串 "" 要变成 "${word2.substring(0, j)}"，唯一的方法就是不断插入字符。

🎯 具体操作：${word2.substring(0, j).split('').map((c, idx) => `第${idx + 1}步插入'${c}'`).join(' → ')}

📐 递推公式：dp[0][j] = dp[0][j-1] + 1 = ${dp[0][j - 1]} + 1 = ${dp[0][j]}
（在前一个状态的基础上，再插入一个字符）`,
      i: 0,
      j: j,
      dpTable: JSON.parse(JSON.stringify(dp)),
      highlightCells: [
        { row: 0, col: j, type: 'current' },
        { row: 0, col: j - 1, type: 'compare' },
      ],
      operation: 'insert',
      codeLines: { java: [6, 7], python: [5, 6], golang: [6, 7], javascript: [5, 6] },
      variables: [
        { name: 'j', value: j, line: 6 },
        { name: 'dp[0][j]', value: dp[0][j], line: 7 },
      ],
      arrows: [{
        from: { row: 0, col: j - 1 },
        to: { row: 0, col: j },
        label: `+1 插入'${word2[j-1]}'`,
      }],
    });
  }

  // 初始化第一列
  for (let i = 1; i <= n1; i++) {
    dp[i][0] = dp[i - 1][0] + 1;
    steps.push({
      id: stepId++,
      description: `📝 初始化第一列 dp[${i}][0] = ${dp[i][0]}`,
      detailDescription: `【为什么这样初始化？】
"${word1.substring(0, i)}" 要变成空字符串 ""，唯一的方法就是不断删除字符。

🎯 具体操作：${word1.substring(0, i).split('').map((c, idx) => `第${idx + 1}步删除'${c}'`).join(' → ')}

📐 递推公式：dp[i][0] = dp[i-1][0] + 1 = ${dp[i - 1][0]} + 1 = ${dp[i][0]}
（在前一个状态的基础上，再删除一个字符）`,
      i: i,
      j: 0,
      dpTable: JSON.parse(JSON.stringify(dp)),
      highlightCells: [
        { row: i, col: 0, type: 'current' },
        { row: i - 1, col: 0, type: 'compare' },
      ],
      operation: 'delete',
      codeLines: { java: [9, 10], python: [8, 9], golang: [9, 10], javascript: [8, 9] },
      variables: [
        { name: 'i', value: i, line: 9 },
        { name: 'dp[i][0]', value: dp[i][0], line: 10 },
      ],
      arrows: [{
        from: { row: i - 1, col: 0 },
        to: { row: i, col: 0 },
        label: `+1 删除'${word1[i-1]}'`,
      }],
    });
  }

  // 填充DP表格
  for (let i = 1; i <= n1; i++) {
    for (let j = 1; j <= n2; j++) {
      const char1 = word1[i - 1];
      const char2 = word2[j - 1];
      
      // 比较字符步骤
      steps.push({
        id: stepId++,
        description: `🔍 比较字符: word1[${i - 1}]='${char1}' vs word2[${j - 1}]='${char2}'`,
        detailDescription: `【当前子问题】
将 "${word1.substring(0, i)}" 转换为 "${word2.substring(0, j)}"

🎯 关键决策点：比较两个字符串的最后一个字符
• word1 的第 ${i} 个字符是 '${char1}'
• word2 的第 ${j} 个字符是 '${char2}'

${char1 === char2 ? 
`✅ 字符相同！不需要任何操作，直接看子问题 dp[${i-1}][${j-1}]` : 
`❌ 字符不同！需要考虑三种操作，选择代价最小的一种`}`,
        i: i,
        j: j,
        dpTable: JSON.parse(JSON.stringify(dp)),
        highlightCells: [
          { row: i, col: j, type: 'current' },
          { row: i - 1, col: j - 1, type: 'compare' },
          { row: i - 1, col: j, type: 'compare' },
          { row: i, col: j - 1, type: 'compare' },
        ],
        codeLines: { java: [12, 13], python: [11, 12], golang: [12, 13], javascript: [11, 12] },
        variables: [
          { name: 'i', value: i, line: 11 },
          { name: 'j', value: j, line: 12 },
          { name: `word1[${i - 1}]`, value: char1, line: 13 },
          { name: `word2[${j - 1}]`, value: char2, line: 13 },
        ],
        comparisonInfo: {
          char1,
          char2,
          isMatch: char1 === char2,
        },
      });

      if (char1 === char2) {
        // 字符相同，不需要操作
        dp[i][j] = dp[i - 1][j - 1];
        steps.push({
          id: stepId++,
          description: `✅ 字符匹配! '${char1}' == '${char2}'`,
          detailDescription: `【为什么直接继承左上角的值？】

🤔 思考过程：
既然 word1[${i-1}]='${char1}' 和 word2[${j-1}]='${char2}' 相同，
那么把 "${word1.substring(0, i)}" 变成 "${word2.substring(0, j)}"
等价于把 "${word1.substring(0, i-1)}" 变成 "${word2.substring(0, j-1)}"
（最后一个字符已经相同，不需要任何操作！）

📐 递推公式：dp[${i}][${j}] = dp[${i-1}][${j-1}] = ${dp[i][j]}
（直接继承左上角的值，不需要 +1）`,
          i: i,
          j: j,
          dpTable: JSON.parse(JSON.stringify(dp)),
          highlightCells: [
            { row: i, col: j, type: 'result' },
            { row: i - 1, col: j - 1, type: 'compare' },
          ],
          operation: 'match',
          codeLines: { java: [14, 15], python: [13, 14], golang: [14, 15], javascript: [13, 14] },
          variables: [
            { name: 'dp[i][j]', value: dp[i][j], line: 15 },
          ],
          arrows: [{
            from: { row: i - 1, col: j - 1 },
            to: { row: i, col: j },
            label: `匹配! 继承=${dp[i][j]}`,
          }],
        });
      } else {
        // 字符不同，取三种操作的最小值
        const insertCost = dp[i][j - 1];
        const deleteCost = dp[i - 1][j];
        const replaceCost = dp[i - 1][j - 1];
        const minCost = Math.min(insertCost, deleteCost, replaceCost);
        dp[i][j] = minCost + 1;

        let operation: 'insert' | 'delete' | 'replace';
        let operationDesc: string;
        let whyThisOperation: string;
        let arrowFrom: { row: number; col: number };

        if (minCost === replaceCost) {
          operation = 'replace';
          operationDesc = `替换 '${char1}'→'${char2}'`;
          whyThisOperation = `【为什么选择替换？】
替换操作的代价 ${replaceCost + 1} 是三种操作中最小的。

🔄 替换的含义：
把 word1[${i-1}]='${char1}' 替换成 '${char2}'，
这样 "${word1.substring(0, i)}" 的最后一个字符就和 "${word2.substring(0, j)}" 的最后一个字符相同了。
剩下的问题就是把 "${word1.substring(0, i-1)}" 变成 "${word2.substring(0, j-1)}"，即 dp[${i-1}][${j-1}]=${replaceCost}。`;
          arrowFrom = { row: i - 1, col: j - 1 };
        } else if (minCost === deleteCost) {
          operation = 'delete';
          operationDesc = `删除 '${char1}'`;
          whyThisOperation = `【为什么选择删除？】
删除操作的代价 ${deleteCost + 1} 是三种操作中最小的。

🗑️ 删除的含义：
从 word1 中删除最后一个字符 '${char1}'，
这样问题就变成了把 "${word1.substring(0, i-1)}" 变成 "${word2.substring(0, j)}"，即 dp[${i-1}][${j}]=${deleteCost}。
删除后再加上这一步删除操作，总代价是 ${deleteCost} + 1 = ${deleteCost + 1}。`;
          arrowFrom = { row: i - 1, col: j };
        } else {
          operation = 'insert';
          operationDesc = `插入 '${char2}'`;
          whyThisOperation = `【为什么选择插入？】
插入操作的代价 ${insertCost + 1} 是三种操作中最小的。

➕ 插入的含义：
在 word1 的末尾插入字符 '${char2}'，
这样 word1 的最后一个字符就和 word2 的最后一个字符 '${char2}' 相同了。
剩下的问题就是把 "${word1.substring(0, i)}" 变成 "${word2.substring(0, j-1)}"，即 dp[${i}][${j-1}]=${insertCost}。`;
          arrowFrom = { row: i, col: j - 1 };
        }

        steps.push({
          id: stepId++,
          description: `❌ 字符不同 '${char1}' ≠ '${char2}' → ${operationDesc}`,
          detailDescription: `【三种操作的代价比较】

← 插入 '${char2}'：dp[${i}][${j-1}] + 1 = ${insertCost} + 1 = ${insertCost + 1}
↑ 删除 '${char1}'：dp[${i-1}][${j}] + 1 = ${deleteCost} + 1 = ${deleteCost + 1}
↖ 替换 '${char1}'→'${char2}'：dp[${i-1}][${j-1}] + 1 = ${replaceCost} + 1 = ${replaceCost + 1}

${whyThisOperation}

📐 最终结果：dp[${i}][${j}] = min(${insertCost + 1}, ${deleteCost + 1}, ${replaceCost + 1}) = ${dp[i][j]}`,
          i: i,
          j: j,
          dpTable: JSON.parse(JSON.stringify(dp)),
          highlightCells: [
            { row: i, col: j, type: 'result' },
            { row: i - 1, col: j - 1, type: minCost === replaceCost ? 'selected' : 'compare' },
            { row: i - 1, col: j, type: minCost === deleteCost ? 'selected' : 'compare' },
            { row: i, col: j - 1, type: minCost === insertCost ? 'selected' : 'compare' },
          ],
          operation: operation,
          codeLines: { java: [16, 17, 18], python: [15, 16, 17], golang: [16, 17, 18], javascript: [15, 16, 17] },
          variables: [
            { name: '← 插入代价', value: insertCost + 1, line: 17 },
            { name: '↑ 删除代价', value: deleteCost + 1, line: 17 },
            { name: '↖ 替换代价', value: replaceCost + 1, line: 17 },
            { name: 'dp[i][j]', value: dp[i][j], line: 18 },
          ],
          arrows: [{
            from: arrowFrom,
            to: { row: i, col: j },
            label: `${operation === 'insert' ? '←插入' : operation === 'delete' ? '↑删除' : '↖替换'} +1=${dp[i][j]}`,
          }],
          operationChoices: {
            insert: { cost: insertCost + 1, selected: minCost === insertCost },
            delete: { cost: deleteCost + 1, selected: minCost === deleteCost },
            replace: { cost: replaceCost + 1, selected: minCost === replaceCost },
          },
        });
      }
    }
  }

  // 最终结果
  steps.push({
    id: stepId++,
    description: `🎉 计算完成!`,
    detailDescription: `【最终答案】
将 "${word1 || '(空)'}" 转换为 "${word2 || '(空)'}"
最小编辑距离 = ${dp[n1][n2]}

📊 结果解读：
这意味着最少需要 ${dp[n1][n2]} 次操作（插入/删除/替换）才能完成转换。

💡 回顾算法思路：
1. 我们用 dp[i][j] 表示 word1 前 i 个字符转换为 word2 前 j 个字符的最小操作数
2. 通过比较最后一个字符，将大问题分解为小问题
3. 如果字符相同，不需要操作；如果不同，选择代价最小的操作
4. 最终 dp[${n1}][${n2}] 就是我们要的答案`,
    i: n1,
    j: n2,
    dpTable: JSON.parse(JSON.stringify(dp)),
    highlightCells: [{ row: n1, col: n2, type: 'result' }],
    codeLines: { java: [20], python: [19], golang: [20], javascript: [19] },
    variables: [
      { name: '最小编辑距离', value: dp[n1][n2], line: 20 },
    ],
  });

  return steps;
};

// 验证输入数据
export const validateInput = (word1: string, word2: string): { valid: boolean; error?: string } => {
  if (word1.length > 500 || word2.length > 500) {
    return { valid: false, error: '字符串长度不能超过500' };
  }
  
  const pattern = /^[a-z]*$/;
  if (!pattern.test(word1)) {
    return { valid: false, error: 'word1 只能包含小写英文字母' };
  }
  if (!pattern.test(word2)) {
    return { valid: false, error: 'word2 只能包含小写英文字母' };
  }
  
  return { valid: true };
};

// 生成随机合法数据
export const generateRandomInput = (): { word1: string; word2: string } => {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const len1 = Math.floor(Math.random() * 6) + 3; // 3-8
  const len2 = Math.floor(Math.random() * 6) + 3; // 3-8
  
  let word1 = '';
  let word2 = '';
  
  for (let i = 0; i < len1; i++) {
    word1 += chars[Math.floor(Math.random() * chars.length)];
  }
  for (let i = 0; i < len2; i++) {
    word2 += chars[Math.floor(Math.random() * chars.length)];
  }
  
  return { word1, word2 };
};
