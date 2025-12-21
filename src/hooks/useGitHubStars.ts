import { useState, useEffect } from 'react';
import { getGitHubStars, saveGitHubStars } from '../utils/indexedDB';

const GITHUB_REPO = 'fuck-algorithm/leetcode-72-edit-distance';
const GITHUB_URL = `https://github.com/${GITHUB_REPO}`;

export const useGitHubStars = () => {
  const [stars, setStars] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        // 先从缓存获取
        const cached = await getGitHubStars();
        setStars(cached.stars);

        // 如果需要刷新
        if (cached.needsFetch) {
          const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`);
          if (response.ok) {
            const data = await response.json();
            const newStars = data.stargazers_count || 0;
            setStars(newStars);
            await saveGitHubStars(newStars);
          }
        }
      } catch (error) {
        console.error('获取GitHub星标数失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStars();
  }, []);

  return { stars, loading, url: GITHUB_URL };
};
