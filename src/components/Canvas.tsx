import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
import type { AlgorithmStep, CellState } from '../types';
import '../styles/Canvas.css';

interface Props {
  step: AlgorithmStep | null;
  word1: string;
  word2: string;
}

const MIN_CELL_SIZE = 40;
const MAX_CELL_SIZE = 80;
const PADDING = 60; // 画布边距

// 根据单元格状态获取CSS类名
const getCellStateClass = (state: CellState): string => {
  return `cell-state-${state}`;
};

const Canvas: React.FC<Props> = ({ step, word1, word2 }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cellSize, setCellSize] = useState(50);
  const [headerSize, setHeaderSize] = useState(40);
  
  // 说明面板拖拽状态
  const [panelPosition, setPanelPosition] = useState<{ x: number; y: number } | null>(null);
  const [isPanelDragging, setIsPanelDragging] = useState(false);
  const [panelDragStart, setPanelDragStart] = useState({ x: 0, y: 0 });

  // 动态计算单元格大小以适应画布
  useEffect(() => {
    if (!containerRef.current) return;

    const updateCellSize = () => {
      const rect = containerRef.current!.getBoundingClientRect();
      const availableWidth = rect.width - PADDING * 2;
      const availableHeight = rect.height - PADDING * 2;

      // 表格需要的列数和行数（包括标题行/列）
      const cols = word2.length + 2; // +2 for header column and empty string column
      const rows = word1.length + 2; // +2 for header row and empty string row

      // 计算能适应画布的单元格大小
      const cellByWidth = availableWidth / cols;
      const cellByHeight = availableHeight / rows;
      
      // 取较小值以确保表格完全可见，并限制在合理范围内
      const newCellSize = Math.max(MIN_CELL_SIZE, Math.min(MAX_CELL_SIZE, Math.min(cellByWidth, cellByHeight)));
      
      setCellSize(newCellSize);
      setHeaderSize(newCellSize * 0.8);
    };

    updateCellSize();

    // 监听窗口大小变化
    const resizeObserver = new ResizeObserver(updateCellSize);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [word1.length, word2.length]);

  // 计算表格尺寸
  const tableWidth = (word2.length + 2) * cellSize;
  const tableHeight = (word1.length + 2) * cellSize;

  // 居中表格（仅在word1/word2/cellSize变化时重新居中，不依赖scale避免循环）
  useEffect(() => {
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      // 使用当前scale值进行计算，但不将其作为依赖项
      setTransform(prev => {
        const centerX = (rect.width - tableWidth * prev.scale) / 2;
        const centerY = (rect.height - tableHeight * prev.scale) / 2;
        return { ...prev, x: centerX, y: centerY };
      });
    }
  }, [word1, word2, tableWidth, tableHeight, cellSize]);

  // 绘制DP表格
  useEffect(() => {
    if (!svgRef.current || !step) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('g.dp-table-group').remove();

    const group = svg.append('g')
      .attr('class', 'dp-table-group')
      .attr('transform', `translate(${transform.x}, ${transform.y}) scale(${transform.scale})`);

    // 定义箭头标记
    const defs = svg.select('defs').empty() ? svg.append('defs') : svg.select('defs');
    (defs as d3.Selection<SVGDefsElement, unknown, null, undefined>).selectAll('*').remove();
    
    // 蓝色箭头（默认）
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#2196F3');

    // 绿色箭头（匹配）
    defs.append('marker')
      .attr('id', 'arrowhead-match')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#4CAF50');

    const dpTable = step.dpTable;
    const n1 = word1.length;
    const n2 = word2.length;

    // 绘制列标题 (word2字符)
    group.append('text')
      .attr('class', 'dp-header-text')
      .attr('x', cellSize * 0.5)
      .attr('y', headerSize * 0.5)
      .text('');

    group.append('text')
      .attr('class', 'dp-header-text empty-string')
      .attr('x', cellSize * 1.5)
      .attr('y', headerSize * 0.5)
      .text('ε');

    for (let j = 0; j < n2; j++) {
      const isHighlighted = step.j === j + 1;
      group.append('text')
        .attr('class', `dp-header-text ${isHighlighted ? 'highlighted' : ''}`)
        .attr('x', (j + 2) * cellSize + cellSize * 0.5)
        .attr('y', headerSize * 0.5)
        .text(word2[j]);
    }

    // 绘制行标题 (word1字符)
    group.append('text')
      .attr('class', 'dp-header-text empty-string')
      .attr('x', cellSize * 0.5)
      .attr('y', headerSize + cellSize * 0.5)
      .text('ε');

    for (let i = 0; i < n1; i++) {
      const isHighlighted = step.i === i + 1;
      group.append('text')
        .attr('class', `dp-header-text ${isHighlighted ? 'highlighted' : ''}`)
        .attr('x', cellSize * 0.5)
        .attr('y', headerSize + (i + 1) * cellSize + cellSize * 0.5)
        .text(word1[i]);
    }

    // 绘制DP表格单元格
    for (let i = 0; i <= n1; i++) {
      for (let j = 0; j <= n2; j++) {
        const x = (j + 1) * cellSize;
        const y = headerSize + i * cellSize;
        
        // 获取单元格状态
        const cellState = step.cellStates?.[i]?.[j] || 'uninitialized';
        const cellStateClass = getCellStateClass(cellState);
        
        // 确定高亮类型（用于向后兼容和额外的视觉效果）
        let highlightType = '';
        const highlight = step.highlightCells.find(h => h.row === i && h.col === j);
        if (highlight) {
          highlightType = highlight.type;
        }

        // 绘制单元格背景 - 使用单元格状态类
        group.append('rect')
          .attr('class', `dp-cell ${cellStateClass} ${highlightType}`)
          .attr('x', x)
          .attr('y', y)
          .attr('width', cellSize)
          .attr('height', cellSize)
          .attr('rx', 4);

        // 绘制单元格值
        const value = dpTable[i]?.[j];
        if (value !== undefined && cellState !== 'uninitialized') {
          group.append('text')
            .attr('class', `dp-cell-text ${cellStateClass}`)
            .attr('x', x + cellSize / 2)
            .attr('y', y + cellSize / 2)
            .text(value);
        }

        // 为compare类型的单元格添加方向标签
        if (highlight && highlight.type === 'compare' && step.i > 0 && step.j > 0) {
          let dirLabel = '';
          if (i === step.i - 1 && j === step.j - 1) dirLabel = '↖';
          else if (i === step.i - 1 && j === step.j) dirLabel = '↑';
          else if (i === step.i && j === step.j - 1) dirLabel = '←';
          
          if (dirLabel) {
            group.append('text')
              .attr('class', 'direction-label')
              .attr('x', x + 8)
              .attr('y', y + 14)
              .text(dirLabel);
          }
        }

        // 为selected类型的单元格添加选中标记
        if (cellState === 'selected' || (highlight && highlight.type === 'selected')) {
          group.append('text')
            .attr('class', 'selected-mark')
            .attr('x', x + cellSize - 10)
            .attr('y', y + 14)
            .text('✓');
        }
      }
    }

    // 绘制箭头
    if (step.arrows) {
      step.arrows.forEach(arrow => {
        const fromX = (arrow.from.col + 1) * cellSize + cellSize / 2;
        const fromY = headerSize + arrow.from.row * cellSize + cellSize / 2;
        const toX = (arrow.to.col + 1) * cellSize + cellSize / 2;
        const toY = headerSize + arrow.to.row * cellSize + cellSize / 2;

        // 计算箭头方向和偏移
        const dx = toX - fromX;
        const dy = toY - fromY;
        const len = Math.sqrt(dx * dx + dy * dy);
        
        // 缩短箭头，不要进入单元格内部
        const offsetStart = cellSize * 0.4;
        const offsetEnd = cellSize * 0.4;
        const startX = fromX + (dx / len) * offsetStart;
        const startY = fromY + (dy / len) * offsetStart;
        const endX = toX - (dx / len) * offsetEnd;
        const endY = toY - (dy / len) * offsetEnd;

        const isMatch = step.operation === 'match';
        const arrowClass = isMatch ? 'arrow-line match' : 'arrow-line';
        const markerId = isMatch ? 'url(#arrowhead-match)' : 'url(#arrowhead)';

        group.append('line')
          .attr('class', arrowClass)
          .attr('x1', startX)
          .attr('y1', startY)
          .attr('x2', endX)
          .attr('y2', endY)
          .attr('marker-end', markerId);

        // 箭头标签
        const labelX = (startX + endX) / 2;
        const labelY = (startY + endY) / 2 - 12;
        const labelWidth = arrow.label.length * 7 + 12;
        
        group.append('rect')
          .attr('class', `arrow-label-bg ${isMatch ? 'match' : ''}`)
          .attr('x', labelX - labelWidth / 2)
          .attr('y', labelY - 10)
          .attr('width', labelWidth)
          .attr('height', 18)
          .attr('rx', 9);

        group.append('text')
          .attr('class', `arrow-label ${isMatch ? 'match' : ''}`)
          .attr('x', labelX)
          .attr('y', labelY + 2)
          .text(arrow.label);
      });
    }

    // 绘制操作标签（在当前单元格上方）
    if (step.operation && step.i >= 0 && step.j >= 0) {
      const opX = (step.j + 1) * cellSize + cellSize / 2;
      const opY = headerSize + step.i * cellSize - 15;
      
      const opLabels: Record<string, { text: string; emoji: string }> = {
        insert: { text: '插入', emoji: '➕' },
        delete: { text: '删除', emoji: '➖' },
        replace: { text: '替换', emoji: '🔄' },
        match: { text: '匹配', emoji: '✅' },
        init: { text: '初始化', emoji: '🚀' },
      };

      const opInfo = opLabels[step.operation];
      if (opInfo && step.operation !== 'init') {
        group.append('text')
          .attr('class', `operation-label ${step.operation}`)
          .attr('x', opX)
          .attr('y', opY)
          .text(`${opInfo.emoji} ${opInfo.text}`);
      }
    }

  }, [step, word1, word2, transform, cellSize, headerSize]);

  // 更新变换
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.select('g.dp-table-group')
      .attr('transform', `translate(${transform.x}, ${transform.y}) scale(${transform.scale})`);
  }, [transform]);

  // 鼠标拖拽
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  }, [transform]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setTransform(prev => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    }));
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 缩放
  const handleZoom = useCallback((delta: number) => {
    setTransform(prev => ({
      ...prev,
      scale: Math.max(0.5, Math.min(2, prev.scale + delta)),
    }));
  }, []);

  // 滚轮缩放
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    handleZoom(delta);
  }, [handleZoom]);

  // 说明面板拖拽处理
  const handlePanelMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPanelDragging(true);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setPanelDragStart({ 
      x: e.clientX - rect.left, 
      y: e.clientY - rect.top 
    });
  }, []);

  const handlePanelMouseMove = useCallback((e: MouseEvent) => {
    if (!isPanelDragging || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newX = e.clientX - containerRect.left - panelDragStart.x;
    const newY = e.clientY - containerRect.top - panelDragStart.y;
    setPanelPosition({ x: newX, y: newY });
  }, [isPanelDragging, panelDragStart]);

  const handlePanelMouseUp = useCallback(() => {
    setIsPanelDragging(false);
  }, []);

  // 监听全局鼠标事件用于面板拖拽
  useEffect(() => {
    if (isPanelDragging) {
      window.addEventListener('mousemove', handlePanelMouseMove);
      window.addEventListener('mouseup', handlePanelMouseUp);
      return () => {
        window.removeEventListener('mousemove', handlePanelMouseMove);
        window.removeEventListener('mouseup', handlePanelMouseUp);
      };
    }
  }, [isPanelDragging, handlePanelMouseMove, handlePanelMouseUp]);

  return (
    <div className="canvas-container" ref={containerRef}>
      <svg
        ref={svgRef}
        className="canvas-svg"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <defs />
      </svg>

      {step && (
        <div 
          className={`step-info-panel ${isPanelDragging ? 'dragging' : ''}`}
          style={panelPosition ? {
            left: panelPosition.x,
            top: panelPosition.y,
            transform: 'none',
            bottom: 'auto'
          } : undefined}
          onMouseDown={handlePanelMouseDown}
        >
          <div className="panel-drag-hint">⋮⋮ 拖拽移动</div>
          <div className="step-header">
            <span className="step-number">步骤 {step.id + 1}</span>
            {step.operation && (
              <span className={`operation-badge ${step.operation}`}>
                {step.operation === 'insert' && '➕ 插入'}
                {step.operation === 'delete' && '➖ 删除'}
                {step.operation === 'replace' && '🔄 替换'}
                {step.operation === 'match' && '✅ 匹配'}
                {step.operation === 'init' && '🚀 初始化'}
              </span>
            )}
          </div>
          <div className="step-description">{step.description}</div>
          {step.detailDescription && (
            <div className="step-detail">{step.detailDescription}</div>
          )}
          {step.operationChoices && (
            <div className="operation-choices">
              <div className={`choice ${step.operationChoices.insert.selected ? 'selected' : ''}`}>
                ← 插入: {step.operationChoices.insert.cost}
              </div>
              <div className={`choice ${step.operationChoices.delete.selected ? 'selected' : ''}`}>
                ↑ 删除: {step.operationChoices.delete.cost}
              </div>
              <div className={`choice ${step.operationChoices.replace.selected ? 'selected' : ''}`}>
                ↖ 替换: {step.operationChoices.replace.cost}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="legend">
        <div className="legend-title">单元格状态</div>
        <div className="legend-item">
          <div className="legend-color uninitialized" />
          <span>未初始化</span>
        </div>
        <div className="legend-item">
          <div className="legend-color initialized" />
          <span>已初始化</span>
        </div>
        <div className="legend-item">
          <div className="legend-color computing" />
          <span>正在计算</span>
        </div>
        <div className="legend-item">
          <div className="legend-color comparing" />
          <span>参与比较</span>
        </div>
        <div className="legend-item">
          <div className="legend-color selected" />
          <span>被选中</span>
        </div>
        <div className="legend-item">
          <div className="legend-color result" />
          <span>计算结果</span>
        </div>
        <div className="legend-item">
          <div className="legend-color final" />
          <span>最终答案</span>
        </div>
      </div>

      <div className="zoom-controls">
        <button className="zoom-btn" onClick={() => handleZoom(0.1)}>+</button>
        <button className="zoom-btn" onClick={() => handleZoom(-0.1)}>−</button>
      </div>
    </div>
  );
};

export default Canvas;
