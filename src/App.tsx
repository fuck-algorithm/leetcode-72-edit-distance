import React, { useState, useMemo, useCallback } from 'react';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import CodePanel from './components/CodePanel';
import Canvas from './components/Canvas';
import ControlPanel from './components/ControlPanel';
import WeChatFloat from './components/WeChatFloat';
import { generateEditDistanceSteps } from './algorithms/editDistance';
import { usePlayback } from './hooks/usePlayback';
import './styles/App.css';

const App: React.FC = () => {
  const [word1, setWord1] = useState('horse');
  const [word2, setWord2] = useState('ros');

  // 生成算法步骤
  const steps = useMemo(() => {
    return generateEditDistanceSteps(word1, word2);
  }, [word1, word2]);

  // 播放控制
  const {
    isPlaying,
    currentStep,
    speed,
    totalSteps,
    togglePlay,
    prevStep,
    nextStep,
    reset,
    goToStep,
    setSpeed,
  } = usePlayback(steps);

  // 处理输入变化
  const handleInputChange = useCallback((newWord1: string, newWord2: string) => {
    setWord1(newWord1);
    setWord2(newWord2);
  }, []);

  const currentStepData = steps[currentStep] || null;

  return (
    <div className="app">
      <Header />
      
      <InputPanel
        word1={word1}
        word2={word2}
        onInputChange={handleInputChange}
      />

      <div className="main-content">
        <div className="left-panel">
          <CodePanel currentStep={currentStepData} />
        </div>

        <div className="canvas-panel">
          <Canvas
            step={currentStepData}
            word1={word1}
            word2={word2}
          />
          
          <ControlPanel
            isPlaying={isPlaying}
            currentStep={currentStep}
            totalSteps={totalSteps}
            speed={speed}
            onTogglePlay={togglePlay}
            onPrevStep={prevStep}
            onNextStep={nextStep}
            onReset={reset}
            onGoToStep={goToStep}
            onSpeedChange={setSpeed}
          />
        </div>
      </div>

      <WeChatFloat />
    </div>
  );
};

export default App;
