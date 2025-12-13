import { useEffect } from 'react';
import { useAppStore } from '@/stores/appStore';

export function useTheme() {
  const { settings, setTheme, toggleTheme, getEffectiveTheme } = useAppStore();

  const effectiveTheme = getEffectiveTheme();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(effectiveTheme);
  }, [effectiveTheme]);

  // Listen for system theme changes when theme is 'system'
  useEffect(() => {
    if (settings.theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      const newTheme = mediaQuery.matches ? 'dark' : 'light';
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(newTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [settings.theme]);

  return {
    theme: settings.theme,
    effectiveTheme,
    setTheme,
    toggleTheme,
  };
}