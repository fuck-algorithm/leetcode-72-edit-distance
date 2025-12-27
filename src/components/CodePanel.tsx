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
    java: ['class', 'public', 'private', 'protected', 'int', 'String', 'new', 'for', 'if', 'else', 'return', 'void', 'static', 'final'],
    python: ['class', 'def', 'for', 'if', 'else', 'elif', 'return', 'in', 'range', 'len', 'min', 'max', 'self', 'True', 'False', 'None'],
    golang: ['func', 'for', 'if', 'else', 'return', 'range', 'make', 'int', 'string', 'var', 'const', 'type', 'struct', 'package', 'import'],
    javascript: ['var', 'const', 'let', 'function', 'for', 'if', 'else', 'return', 'new', 'this', 'true', 'false', 'null', 'undefined'],
  };

  const tokenize = (line: string, lang: Language): React.ReactNode[] => {
    const tokens: React.ReactNode[] = [];
    let remaining = line;
    let key = 0;

    while (remaining.length > 0) {
      // 检查注释
      const commentMatch = remaining.match(/^(\/\/.*|#.*)/);
      if (commentMatch) {
        tokens.push(<span key={key++} className="comment">{commentMatch[0]}</span>);
        remaining = remaining.slice(commentMatch[0].length);
        continue;
      }

      // 检查字符串（双引号）
      const doubleQuoteMatch = remaining.match(/^"[^"]*"/);
      if (doubleQuoteMatch) {
        tokens.push(<span key={key++} className="string">{doubleQuoteMatch[0]}</span>);
        remaining = remaining.slice(doubleQuoteMatch[0].length);
        continue;
      }

      // 检查字符串（单引号）
      const singleQuoteMatch = remaining.match(/^'[^']*'/);
      if (singleQuoteMatch) {
        tokens.push(<span key={key++} className="string">{singleQuoteMatch[0]}</span>);
        remaining = remaining.slice(singleQuoteMatch[0].length);
        continue;
      }

      // 检查关键字
      const keywordPattern = new RegExp(`^\\b(${keywords[lang].join('|')})\\b`);
      const keywordMatch = remaining.match(keywordPattern);
      if (keywordMatch) {
        tokens.push(<span key={key++} className="keyword">{keywordMatch[0]}</span>);
        remaining = remaining.slice(keywordMatch[0].length);
        continue;
      }

      // 检查数字
      const numberMatch = remaining.match(/^\b\d+\b/);
      if (numberMatch) {
        tokens.push(<span key={key++} className="number">{numberMatch[0]}</span>);
        remaining = remaining.slice(numberMatch[0].length);
        continue;
      }

      // 检查函数调用
      const funcMatch = remaining.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
      if (funcMatch) {
        tokens.push(<span key={key++} className="function">{funcMatch[1]}</span>);
        remaining = remaining.slice(funcMatch[1].length);
        continue;
      }

      // 普通字符
      tokens.push(remaining[0]);
      remaining = remaining.slice(1);
    }

    return tokens;
  };

  return lines.map((line, index) => (
    <span key={index} className="code-line-text">
      {tokenize(line, language)}
    </span>
  ));
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
