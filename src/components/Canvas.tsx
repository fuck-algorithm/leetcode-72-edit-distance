import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
import type { AlgorithmStep } from '../types';
import '../styles/Canvas.css';

interface Props {
  step: AlgorithmStep | null;
  word1: string;
  word2: string;
}

const CELL_SIZE = 50;
const HEADER_SIZE = 40;

const Canvas: React.FC<Props> = ({ step, word1, word2 }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // 计算表格尺寸
  const tableWidth = (word2.length + 2) * CELL_SIZE;
  const tableHeight = (word1.length + 2) * CELL_SIZE;

  // 居中表格
  useEffect(() => {
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const centerX = (rect.width - tableWidth * transform.scale) / 2;
      const centerY = (rect.height - tableHeight * transform.scale) / 2;
      setTransform(prev => ({ ...prev, x: centerX, y: centerY }));
    }
  }, [word1, word2, tableWidth, tableHeight]);

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

    const dpTable = step.dpTable;
    const n1 = word1.length;
    const n2 = word2.length;

    // 绘制列标题 (word2字符)
    group.append('text')
      .attr('class', 'dp-header-text')
      .attr('x', CELL_SIZE * 0.5)
      .attr('y', HEADER_SIZE * 0.5)
      .text('');

    group.append('text')
      .attr('class', 'dp-header-text')
      .attr('x', CELL_SIZE * 1.5)
      .attr('y', HEADER_SIZE * 0.5)
      .text('""');

    for (let j = 0; j < n2; j++) {
      group.append('text')
        .attr('class', 'dp-header-text')
        .attr('x', (j + 2) * CELL_SIZE + CELL_SIZE * 0.5)
        .attr('y', HEADER_SIZE * 0.5)
        .text(word2[j]);
    }

    // 绘制行标题 (word1字符)
    group.append('text')
      .attr('class', 'dp-header-text')
      .attr('x', CELL_SIZE * 0.5)
      .attr('y', HEADER_SIZE + CELL_SIZE * 0.5)
      .text('""');

    for (let i = 0; i < n1; i++) {
      group.append('text')
        .attr('class', 'dp-header-text')
        .attr('x', CELL_SIZE * 0.5)
        .attr('y', HEADER_SIZE + (i + 1) * CELL_SIZE + CELL_SIZE * 0.5)
        .text(word1[i]);
    }

    // 绘制DP表格单元格
    for (let i = 0; i <= n1; i++) {
      for (let j = 0; j <= n2; j++) {
        const x = (j + 1) * CELL_SIZE;
        const y = HEADER_SIZE + i * CELL_SIZE;
        
        // 确定单元格类型
        let cellType = 'default';
        const highlight = step.highlightCells.find(h => h.row === i && h.col === j);
        if (highlight) {
          cellType = highlight.type;
        }

        // 绘制单元格背景
        group.append('rect')
          .attr('class', `dp-cell ${cellType}`)
          .attr('x', x)
          .attr('y', y)
          .attr('width', CELL_SIZE)
          .attr('height', CELL_SIZE)
          .attr('rx', 4);

        // 绘制单元格值
        const value = dpTable[i]?.[j];
        if (value !== undefined) {
          group.append('text')
            .attr('class', 'dp-cell-text')
            .attr('x', x + CELL_SIZE / 2)
            .attr('y', y + CELL_SIZE / 2)
            .text(value);
        }
      }
    }

    // 绘制箭头
    if (step.arrows) {
      step.arrows.forEach(arrow => {
        const fromX = (arrow.from.col + 1) * CELL_SIZE + CELL_SIZE / 2;
        const fromY = HEADER_SIZE + arrow.from.row * CELL_SIZE + CELL_SIZE / 2;
        const toX = (arrow.to.col + 1) * CELL_SIZE + CELL_SIZE / 2;
        const toY = HEADER_SIZE + arrow.to.row * CELL_SIZE + CELL_SIZE / 2;

        // 计算箭头路径（曲线）
        const midX = (fromX + toX) / 2;
        const midY = (fromY + toY) / 2 - 20;

        group.append('path')
          .attr('class', 'arrow-line')
          .attr('d', `M${fromX},${fromY} Q${midX},${midY} ${toX - 10},${toY - 10}`);

        // 箭头标签背景
        const labelX = midX;
        const labelY = midY - 10;
        const labelWidth = arrow.label.length * 8 + 10;
        
        group.append('rect')
          .attr('class', 'arrow-label-bg')
          .attr('x', labelX - labelWidth / 2)
          .attr('y', labelY - 10)
          .attr('width', labelWidth)
          .attr('height', 18);

        group.append('text')
          .attr('class', 'arrow-label')
          .attr('x', labelX)
          .attr('y', labelY + 2)
          .text(arrow.label);
      });
    }

    // 绘制操作标签
    if (step.operation && step.i >= 0 && step.j >= 0) {
      const opX = (step.j + 1) * CELL_SIZE + CELL_SIZE / 2;
      const opY = HEADER_SIZE + step.i * CELL_SIZE - 10;
      
      const opLabels: Record<string, string> = {
        insert: '插入',
        delete: '删除',
        replace: '替换',
        match: '匹配',
        init: '初始化',
      };

      group.append('text')
        .attr('class', `operation-label ${step.operation}`)
        .attr('x', opX)
        .attr('y', opY)
        .text(opLabels[step.operation] || '');
    }

  }, [step, word1, word2, transform]);

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

  return (
    <div className="canvas-container">
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
        <div className="step-description">
          {step.description}
        </div>
      )}

      <div className="legend">
        <div className="legend-title">图例</div>
        <div className="legend-item">
          <div className="legend-color current" />
          <span>当前单元格</span>
        </div>
        <div className="legend-item">
          <div className="legend-color compare" />
          <span>比较单元格</span>
        </div>
        <div className="legend-item">
          <div className="legend-color result" />
          <span>结果单元格</span>
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
