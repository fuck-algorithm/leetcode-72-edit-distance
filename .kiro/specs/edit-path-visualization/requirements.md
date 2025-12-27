# Requirements Document

## Introduction

本功能旨在改进编辑距离算法可视化工具的用户体验，帮助用户更直观地理解编辑距离的概念以及字符串转换的具体过程。当前用户反馈主要问题是：看完DP表格动画后仍然不理解编辑距离是什么，以及如何将一个字符串一步步编辑成另一个字符串。

## Glossary

- **Edit Distance (编辑距离)**: 将一个字符串转换为另一个字符串所需的最少操作次数
- **Edit Path (编辑路径)**: 从源字符串到目标字符串的具体操作序列
- **DP Table (动态规划表格)**: 存储子问题解的二维表格
- **Operation (操作)**: 插入、删除或替换字符的单次编辑动作
- **Transformation Panel (转换面板)**: 展示字符串逐步转换过程的UI组件
- **Backtrack (回溯)**: 从DP表格右下角追溯到左上角以还原最优编辑路径的过程

## Requirements

### Requirement 1

**User Story:** As a learner, I want to see the actual string transformation process step by step, so that I can understand how one string becomes another through edit operations.

#### Acceptance Criteria

1. WHEN the DP table calculation completes THEN the System SHALL display a transformation panel showing the source string and target string side by side
2. WHEN the user clicks "Show Edit Path" button THEN the System SHALL highlight the optimal path cells in the DP table from bottom-right to top-left
3. WHEN displaying the edit path THEN the System SHALL show each operation (insert/delete/replace/match) with the corresponding character change
4. WHEN an edit operation is highlighted THEN the System SHALL animate the source string transforming character by character toward the target string
5. WHEN the transformation animation plays THEN the System SHALL display the current intermediate string state clearly

### Requirement 2

**User Story:** As a beginner, I want to understand what edit distance means before seeing the algorithm, so that I have the right mental model.

#### Acceptance Criteria

1. WHEN the user first opens the visualization THEN the System SHALL display an introductory tooltip explaining edit distance in simple terms
2. WHEN the user hovers over the final result cell THEN the System SHALL show a summary explaining "X operations needed to transform A to B"
3. WHEN displaying operation counts THEN the System SHALL break down the total into insert/delete/replace counts

### Requirement 3

**User Story:** As a visual learner, I want to see the string transformation animated in real-time, so that I can follow along with each edit step.

#### Acceptance Criteria

1. WHEN an insert operation occurs THEN the System SHALL animate a new character appearing at the correct position with a visual highlight
2. WHEN a delete operation occurs THEN the System SHALL animate the character fading out and being removed from the string
3. WHEN a replace operation occurs THEN the System SHALL animate the old character morphing into the new character
4. WHEN a match operation occurs THEN the System SHALL briefly highlight the matching character without modification
5. WHEN the animation plays THEN the System SHALL synchronize the string transformation with the DP table cell highlighting

### Requirement 4

**User Story:** As a user, I want playback controls for the edit path visualization, so that I can review specific transformations at my own pace.

#### Acceptance Criteria

1. WHEN viewing the edit path THEN the System SHALL provide play/pause controls for the transformation animation
2. WHEN the animation is paused THEN the System SHALL allow stepping forward and backward through individual operations
3. WHEN stepping through operations THEN the System SHALL update both the string display and DP table highlighting simultaneously
4. WHEN the user adjusts playback speed THEN the System SHALL apply the speed setting to the transformation animation

### Requirement 5

**User Story:** As a learner, I want to see a clear operation log, so that I can review all the steps taken to transform the string.

#### Acceptance Criteria

1. WHEN the edit path is calculated THEN the System SHALL display a scrollable operation log panel
2. WHEN displaying operations THEN the System SHALL format each entry as "Step N: [Operation] 'char' at position P"
3. WHEN the user clicks an operation in the log THEN the System SHALL jump to that step in the visualization
4. WHEN an operation is active THEN the System SHALL highlight the corresponding log entry

