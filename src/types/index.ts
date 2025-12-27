// 单元格状态类型
export type CellState = 
  | 'uninitialized'  // 未初始化 - 还没有计算过的单元格
  | 'initialized'    // 已初始化 - 已经计算完成的单元格
  | 'computing'      // 正在计算 - 当前正在计算的单元格
  | 'comparing'      // 参与比较 - 作为计算来源被比较的单元格
  | 'selected'       // 被选中 - 最终被选择作为来源的单元格
  | 'result'         // 计算结果 - 刚刚计算完成的单元格
  | 'final';         // 最终答案 - 最终结果单元格

// 单元格状态矩阵类型
export type CellStateMatrix = CellState[][];

// 高亮单元格类型（保持向后兼容）
export type HighlightType = 'current' | 'compare' | 'result' | 'selected';

// 算法步骤类型
export interface AlgorithmStep {
  id: number;
  description: string;
  // 详细描述（多行）
  detailDescription?: string;
  // 当前比较的位置
  i: number;
  j: number;
  // DP表格状态
  dpTable: number[][];
  // 单元格状态矩阵 - 每个单元格的状态
  cellStates: CellStateMatrix;
  // 高亮的单元格（保持向后兼容）
  highlightCells: { row: number; col: number; type: HighlightType }[];
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
  // 字符比较信息
  comparisonInfo?: {
    char1: string;
    char2: string;
    isMatch: boolean;
  };
  // 操作选择信息
  operationChoices?: {
    insert: { cost: number; selected: boolean };
    delete: { cost: number; selected: boolean };
    replace: { cost: number; selected: boolean };
  };
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
