import React, { useMemo } from 'react';
import type { Language, AlgorithmStep } from '../types';
import { codeTemplates, languageNames } from '../algorithms/codeTemplates';
import { useLanguage } from '../hooks/useLanguage';
import '../styles/CodePanel.css';

interface Props {
  currentStep: AlgorithmStep | null;
}

const languages: Language[] = ['java', 'python', 'golang', 'javascript'];

// 简单的语法高亮
const highlightCode = (code: string, language: Language): React.ReactNode[] => {
  const lines = code.split('\n');
  
  const keywords: Record<Language, string[]> = {
    java: ['class', 'public', 'int', 'String', 'new', 'for', 'if', 'else', 'return'],
    python: ['class', 'def', 'for', 'if', 'else', 'return', 'in', 'range', 'len', 'min'],
    golang: ['func', 'for', 'if', 'else', 'return', 'range', 'make', 'int', 'string'],
    javascript: ['var', 'const', 'let', 'function', 'for', 'if', 'else', 'return', 'new'],
  };

  return lines.map((line, index) => {
    let highlighted = line;
    
    // 高亮注释
    if (line.includes('//')) {
      const commentIndex = line.indexOf('//');
      const before = line.substring(0, commentIndex);
      const comment = line.substring(commentIndex);
      highlighted = `${before}<span class="comment">${comment}</span>`;
    } else if (line.trim().startsWith('#')) {
      highlighted = `<span class="comment">${line}</span>`;
    } else {
      // 高亮关键字
      keywords[language].forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        highlighted = highlighted.replace(regex, `<span class="keyword">${keyword}</span>`);
      });
      
      // 高亮字符串
      highlighted = highlighted.replace(/"[^"]*"/g, match => `<span class="string">${match}</span>`);
      highlighted = highlighted.replace(/'[^']*'/g, match => `<span class="string">${match}</span>`);
      
      // 高亮数字
      highlighted = highlighted.replace(/\b\d+\b/g, match => `<span class="number">${match}</span>`);
    }
    
    return (
      <span
        key={index}
        className="code-line-text"
        dangerouslySetInnerHTML={{ __html: highlighted || ' ' }}
      />
    );
  });
};

const CodePanel: React.FC<Props> = ({ currentStep }) => {
  const { language, changeLanguage } = useLanguage();
  
  const code = codeTemplates[language];
  const lines = code.split('\n');
  const highlightedLines = currentStep?.codeLines[language] || [];
  
  const highlightedCode = useMemo(() => highlightCode(code, language), [code, language]);
  
  // 获取当前步骤的变量值
  const getVariableForLine = (lineNumber: number) => {
    if (!currentStep) return null;
    return currentStep.variables.find(v => v.line === lineNumber);
  };

  return (
    <div className="code-panel">
      <div className="code-header">
        <div className="language-tabs">
          {languages.map(lang => (
            <button
              key={lang}
              className={`language-tab ${language === lang ? 'active' : ''}`}
              onClick={() => changeLanguage(lang)}
            >
              {languageNames[lang]}
            </button>
          ))}
        </div>
      </div>
      <div className="code-container">
        <div className="code-content">
          <div className="line-numbers">
            {lines.map((_, index) => (
              <div key={index} className="line-number">
                {index + 1}
              </div>
            ))}
          </div>
          <div className="code-lines">
            {highlightedCode.map((lineContent, index) => {
              const lineNumber = index + 1;
              const isHighlighted = highlightedLines.includes(lineNumber);
              const variable = getVariableForLine(lineNumber);
              
              return (
                <div
                  key={index}
                  className={`code-line ${isHighlighted ? 'highlighted' : ''}`}
                >
                  {lineContent}
                  {variable && isHighlighted && (
                    <span className="variable-value">
                      {variable.name} = {variable.value}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePanel;
