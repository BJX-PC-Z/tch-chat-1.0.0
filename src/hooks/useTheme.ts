import { useState, useEffect, useCallback } from 'react';
import { Theme } from '@/types';
import { loadFromLocalStorage, saveToLocalStorage } from '@/utils';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    return loadFromLocalStorage('tch-theme', 'dark');
  });

  const [systemTheme, setSystemTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  // 检测系统主题变化
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // 应用主题到DOM
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    
    // 移除所有主题类
    root.classList.remove('light', 'dark');
    
    // 应用当前主题
    root.classList.add(theme);
    
    // 设置CSS变量
    if (theme === 'dark') {
      root.style.setProperty('--background', '222.2% 84% 4.9%');
      root.style.setProperty('--foreground', '210% 40% 98%');
    } else {
      root.style.setProperty('--background', '0% 0% 100%');
      root.style.setProperty('--foreground', '222.2% 84% 4.9%');
    }

    // 保存主题设置
    saveToLocalStorage('tch-theme', theme);
  }, [theme]);

  // 切换主题
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  // 设置特定主题
  const setThemeMode = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
  }, []);

  // 自动主题（跟随系统）
  const setAutoTheme = useCallback(() => {
    setTheme(systemTheme);
  }, [systemTheme]);

  // 获取当前应该使用的实际主题
  const getEffectiveTheme = useCallback(() => {
    return theme === 'auto' ? systemTheme : theme;
  }, [theme, systemTheme]);

  // 检查是否为暗色主题
  const isDark = useCallback(() => {
    return getEffectiveTheme() === 'dark';
  }, [getEffectiveTheme]);

  // 获取主题图标
  const getThemeIcon = useCallback(() => {
    switch (theme) {
      case 'light':
        return 'Sun';
      case 'dark':
        return 'Moon';
      case 'auto':
        return systemTheme === 'dark' ? 'Moon' : 'Sun';
      default:
        return 'Moon';
    }
  }, [theme, systemTheme]);

  // 获取主题名称
  const getThemeName = useCallback(() => {
    switch (theme) {
      case 'light':
        return '浅色';
      case 'dark':
        return '深色';
      case 'auto':
        return '自动';
      default:
        return '深色';
    }
  }, [theme]);

  return {
    theme,
    systemTheme,
    toggleTheme,
    setThemeMode,
    setAutoTheme,
    getEffectiveTheme,
    isDark,
    getThemeIcon,
    getThemeName,
  };
}