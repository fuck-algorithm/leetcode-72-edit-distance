import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';

interface AlgorithmVisualizerDB extends DBSchema {
  settings: {
    key: string;
    value: {
      key: string;
      value: string | number;
      timestamp: number;
    };
  };
  github: {
    key: string;
    value: {
      key: string;
      stars: number;
      timestamp: number;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<AlgorithmVisualizerDB>> | null = null;

const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<AlgorithmVisualizerDB>('algorithm-visualizer', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('github')) {
          db.createObjectStore('github', { keyPath: 'key' });
        }
      },
    });
  }
  return dbPromise;
};

// 保存设置
export const saveSetting = async (key: string, value: string | number): Promise<void> => {
  const db = await getDB();
  await db.put('settings', {
    key,
    value,
    timestamp: Date.now(),
  });
};

// 获取设置
export const getSetting = async <T extends string | number>(key: string, defaultValue: T): Promise<T> => {
  try {
    const db = await getDB();
    const result = await db.get('settings', key);
    if (result) {
      return result.value as T;
    }
  } catch (error) {
    console.error('获取设置失败:', error);
  }
  return defaultValue;
};

// 保存GitHub星标数
export const saveGitHubStars = async (stars: number): Promise<void> => {
  const db = await getDB();
  await db.put('github', {
    key: 'stars',
    stars,
    timestamp: Date.now(),
  });
};

// 获取GitHub星标数（带缓存）
export const getGitHubStars = async (): Promise<{ stars: number; needsFetch: boolean }> => {
  try {
    const db = await getDB();
    const result = await db.get('github', 'stars');
    if (result) {
      const oneHour = 60 * 60 * 1000;
      const needsFetch = Date.now() - result.timestamp > oneHour;
      return { stars: result.stars, needsFetch };
    }
  } catch (error) {
    console.error('获取GitHub星标数失败:', error);
  }
  return { stars: 0, needsFetch: true };
};
