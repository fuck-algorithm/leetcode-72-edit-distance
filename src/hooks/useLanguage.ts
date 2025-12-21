import { useState, useEffect, useCallback } from 'react';
import type { Language } from '../types';
import { getSetting, saveSetting } from '../utils/indexedDB';

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>('java');

  // 加载保存的语言设置
  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await getSetting<string>('codeLanguage', 'java');
      setLanguage(savedLanguage as Language);
    };
    loadLanguage();
  }, []);

  // 切换语言
  const changeLanguage = useCallback(async (newLanguage: Language) => {
    setLanguage(newLanguage);
    await saveSetting('codeLanguage', newLanguage);
  }, []);

  return { language, changeLanguage };
};
