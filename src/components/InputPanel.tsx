import React, { useState, useCallback } from 'react';
import { validateInput, generateRandomInput } from '../algorithms/editDistance';
import type { ExampleData } from '../types';
import '../styles/InputPanel.css';

interface Props {
  word1: string;
  word2: string;
  onInputChange: (word1: string, word2: string) => void;
}

const examples: ExampleData[] = [
  { name: '示例1', word1: 'horse', word2: 'ros' },
  { name: '示例2', word1: 'intention', word2: 'execution' },
  { name: '简单', word1: 'abc', word2: 'adc' },
  { name: '相同', word1: 'same', word2: 'same' },
  { name: '空串', word1: '', word2: 'abc' },
];

const InputPanel: React.FC<Props> = ({ word1, word2, onInputChange }) => {
  const [localWord1, setLocalWord1] = useState(word1);
  const [localWord2, setLocalWord2] = useState(word2);
  const [error, setError] = useState<string | null>(null);

  const handleApply = useCallback(() => {
    const validation = validateInput(localWord1, localWord2);
    if (!validation.valid) {
      setError(validation.error || '输入无效');
      return;
    }
    setError(null);
    onInputChange(localWord1, localWord2);
  }, [localWord1, localWord2, onInputChange]);

  const handleRandom = useCallback(() => {
    const { word1: newWord1, word2: newWord2 } = generateRandomInput();
    setLocalWord1(newWord1);
    setLocalWord2(newWord2);
    setError(null);
    onInputChange(newWord1, newWord2);
  }, [onInputChange]);

  const handleExample = useCallback((example: ExampleData) => {
    setLocalWord1(example.word1);
    setLocalWord2(example.word2);
    setError(null);
    onInputChange(example.word1, example.word2);
  }, [onInputChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  }, [handleApply]);

  return (
    <div className="input-panel">
      <div className="input-inline">
        <label className="input-label">word1:</label>
        <input
          type="text"
          className={`input-field ${error ? 'error' : ''}`}
          value={localWord1}
          onChange={e => setLocalWord1(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="单词1"
        />
        <label className="input-label">word2:</label>
        <input
          type="text"
          className={`input-field ${error ? 'error' : ''}`}
          value={localWord2}
          onChange={e => setLocalWord2(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="单词2"
        />
        <button className="action-btn primary" onClick={handleApply}>
          应用
        </button>
        <button className="action-btn" onClick={handleRandom}>
          随机
        </button>
        <span className="divider">|</span>
        {examples.map((example, index) => (
          <button
            key={index}
            className="example-btn"
            onClick={() => handleExample(example)}
          >
            {example.name}
          </button>
        ))}
        {error && <span className="error-message">{error}</span>}
      </div>
    </div>
  );
};

export default InputPanel;
