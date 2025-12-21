// 算法步骤类型
export interface AlgorithmStep {
  id: number;
  description: string;
  // 当前比较的位置
  i: number;
  j: number;
  // DP表格状态
  dpTable: number[][];
  // 高亮的单元格
  highlightCells: { row: number; col: number; type: 'current' | 'compare' | 'result' }[];
  // 操作类型
  operation?: 'insert' | 'delete' | 'replace' | 'match' | 'init';
  // 代码行号映射
  codeLines: {
    java: number[];
    python: number[];
    golang: number[];
    javascript: number[];
  };
  // 变量状态
  variables: {
    name: string;
    value: string | number;
    line: number;
  }[];
  // 箭头指示
  arrows?: {
    from: { row: number; col: number };
    to: { row: number; col: number };
    label: string;
  }[];
}

// 语言类型
export type Language = 'java' | 'python' | 'golang' | 'javascript';

// 播放状态
export interface PlaybackState {
  isPlaying: boolean;
  currentStep: number;
  speed: number;
  totalSteps: number;
}

// 输入数据
export interface InputData {
  word1: string;
  word2: string;
}

// 示例数据
export interface ExampleData {
  name: string;
  word1: string;
  word2: string;
}

// GitHub仓库信息
export interface GitHubInfo {
  stars: number;
  url: string;
}
