import { useState, useEffect, useCallback, useRef } from 'react';
import { getSetting, saveSetting } from '../utils/indexedDB';
import type { AlgorithmStep } from '../types';

export const usePlayback = (steps: AlgorithmStep[]) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<number | null>(null);

  // 加载保存的速度设置
  useEffect(() => {
    const loadSpeed = async () => {
      const savedSpeed = await getSetting<number>('playbackSpeed', 1);
      setSpeed(savedSpeed);
    };
    loadSpeed();
  }, []);

  // 保存速度设置
  const handleSpeedChange = useCallback(async (newSpeed: number) => {
    setSpeed(newSpeed);
    await saveSetting('playbackSpeed', newSpeed);
  }, []);

  // 播放/暂停
  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  // 上一步
  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(0, prev - 1));
    setIsPlaying(false);
  }, []);

  // 下一步
  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(steps.length - 1, prev + 1));
    setIsPlaying(false);
  }, [steps.length]);

  // 重置
  const reset = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  // 跳转到指定步骤
  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.max(0, Math.min(steps.length - 1, step)));
  }, [steps.length]);

  // 自动播放
  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      intervalRef.current = window.setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, speed, steps.length, currentStep]);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 如果焦点在输入框中，不处理快捷键
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevStep();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextStep();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          reset();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, prevStep, nextStep, reset]);

  return {
    isPlaying,
    currentStep,
    speed,
    totalSteps: steps.length,
    togglePlay,
    prevStep,
    nextStep,
    reset,
    goToStep,
    setSpeed: handleSpeedChange,
  };
};
