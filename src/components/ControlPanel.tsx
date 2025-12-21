import React, { useCallback, useRef, useState } from 'react';
import '../styles/ControlPanel.css';

interface Props {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  onTogglePlay: () => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  onReset: () => void;
  onGoToStep: (step: number) => void;
  onSpeedChange: (speed: number) => void;
}

const ControlPanel: React.FC<Props> = ({
  isPlaying,
  currentStep,
  totalSteps,
  speed,
  onTogglePlay,
  onPrevStep,
  onNextStep,
  onReset,
  onGoToStep,
  onSpeedChange,
}) => {
  const progressRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const progress = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0;

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const step = Math.round(percentage * (totalSteps - 1));
    onGoToStep(step);
  }, [totalSteps, onGoToStep]);

  const handleProgressDrag = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    const step = Math.round(percentage * (totalSteps - 1));
    onGoToStep(step);
  }, [isDragging, totalSteps, onGoToStep]);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className="control-panel">
      <div className="control-buttons">
        <button
          className="control-btn"
          onClick={onPrevStep}
          disabled={currentStep === 0}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          上一步
          <span className="shortcut-hint">←</span>
        </button>

        <button
          className={`control-btn ${isPlaying ? '' : 'primary'}`}
          onClick={onTogglePlay}
        >
          {isPlaying ? (
            <>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
              暂停
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              播放
            </>
          )}
          <span className="shortcut-hint">Space</span>
        </button>

        <button
          className="control-btn"
          onClick={onNextStep}
          disabled={currentStep === totalSteps - 1}
        >
          下一步
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
          <span className="shortcut-hint">→</span>
        </button>

        <button className="control-btn" onClick={onReset}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          重置
          <span className="shortcut-hint">R</span>
        </button>

        <div className="speed-control">
          <span className="speed-label">速度:</span>
          <div className="speed-slider-container">
            <input
              type="range"
              className="speed-slider"
              min="0.5"
              max="3"
              step="0.5"
              value={speed}
              onChange={e => onSpeedChange(parseFloat(e.target.value))}
            />
            <span className="speed-value">{speed}x</span>
          </div>
        </div>
      </div>

      <div className="progress-container">
        <div
          ref={progressRef}
          className="progress-bar"
          onClick={handleProgressClick}
          onMouseMove={handleProgressDrag}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="progress-fill" style={{ width: `${progress}%` }} />
          <div
            className="progress-handle"
            style={{ left: `${progress}%` }}
            onMouseDown={handleMouseDown}
          />
        </div>
        <div className="progress-info">
          <span>步骤 {currentStep + 1} / {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
