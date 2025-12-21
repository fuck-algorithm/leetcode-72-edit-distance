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
    description: `初始化DP表格，大小为 ${n1 + 1} x ${n2 + 1}`,
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
      description: `初始化第一行: dp[0][${j}] = ${dp[0][j]}，表示空字符串变成 "${word2.substring(0, j)}" 需要 ${j} 次插入`,
      i: 0,
      j: j,
      dpTable: JSON.parse(JSON.stringify(dp)),
      highlightCells: [{ row: 0, col: j, type: 'current' }],
      operation: 'insert',
      codeLines: { java: [6, 7], python: [5, 6], golang: [6, 7], javascript: [5, 6] },
      variables: [
        { name: 'j', value: j, line: 6 },
        { name: 'dp[0][j]', value: dp[0][j], line: 7 },
      ],
      arrows: j > 1 ? [{
        from: { row: 0, col: j - 1 },
        to: { row: 0, col: j },
        label: '+1 (插入)',
      }] : undefined,
    });
  }

  // 初始化第一列
  for (let i = 1; i <= n1; i++) {
    dp[i][0] = dp[i - 1][0] + 1;
    steps.push({
      id: stepId++,
      description: `初始化第一列: dp[${i}][0] = ${dp[i][0]}，表示 "${word1.substring(0, i)}" 变成空字符串需要 ${i} 次删除`,
      i: i,
      j: 0,
      dpTable: JSON.parse(JSON.stringify(dp)),
      highlightCells: [{ row: i, col: 0, type: 'current' }],
      operation: 'delete',
      codeLines: { java: [9, 10], python: [8, 9], golang: [9, 10], javascript: [8, 9] },
      variables: [
        { name: 'i', value: i, line: 9 },
        { name: 'dp[i][0]', value: dp[i][0], line: 10 },
      ],
      arrows: i > 1 ? [{
        from: { row: i - 1, col: 0 },
        to: { row: i, col: 0 },
        label: '+1 (删除)',
      }] : undefined,
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
        description: `比较 word1[${i - 1}]='${char1}' 和 word2[${j - 1}]='${char2}'`,
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
      });

      if (char1 === char2) {
        // 字符相同，不需要操作
        dp[i][j] = dp[i - 1][j - 1];
        steps.push({
          id: stepId++,
          description: `字符相同 '${char1}' == '${char2}'，dp[${i}][${j}] = dp[${i - 1}][${j - 1}] = ${dp[i][j]}`,
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
            label: '相同，直接继承',
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
        let arrowFrom: { row: number; col: number };

        if (minCost === replaceCost) {
          operation = 'replace';
          operationDesc = `替换 '${char1}' 为 '${char2}'`;
          arrowFrom = { row: i - 1, col: j - 1 };
        } else if (minCost === deleteCost) {
          operation = 'delete';
          operationDesc = `删除 '${char1}'`;
          arrowFrom = { row: i - 1, col: j };
        } else {
          operation = 'insert';
          operationDesc = `插入 '${char2}'`;
          arrowFrom = { row: i, col: j - 1 };
        }

        steps.push({
          id: stepId++,
          description: `字符不同，选择最小操作: ${operationDesc}，dp[${i}][${j}] = min(${insertCost}, ${deleteCost}, ${replaceCost}) + 1 = ${dp[i][j]}`,
          i: i,
          j: j,
          dpTable: JSON.parse(JSON.stringify(dp)),
          highlightCells: [
            { row: i, col: j, type: 'result' },
            { row: i - 1, col: j - 1, type: 'compare' },
            { row: i - 1, col: j, type: 'compare' },
            { row: i, col: j - 1, type: 'compare' },
          ],
          operation: operation,
          codeLines: { java: [16, 17, 18], python: [15, 16, 17], golang: [16, 17, 18], javascript: [15, 16, 17] },
          variables: [
            { name: '插入代价', value: insertCost + 1, line: 17 },
            { name: '删除代价', value: deleteCost + 1, line: 17 },
            { name: '替换代价', value: replaceCost + 1, line: 17 },
            { name: 'dp[i][j]', value: dp[i][j], line: 18 },
          ],
          arrows: [{
            from: arrowFrom,
            to: { row: i, col: j },
            label: `+1 (${operation === 'insert' ? '插入' : operation === 'delete' ? '删除' : '替换'})`,
          }],
        });
      }
    }
  }

  // 最终结果
  steps.push({
    id: stepId++,
    description: `算法完成！将 "${word1}" 转换为 "${word2}" 的最小编辑距离为 ${dp[n1][n2]}`,
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
