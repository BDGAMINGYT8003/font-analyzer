'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize with 'dark' to match the server-side default and script
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    // On mount, sync with actual classList or localStorage
    const storedTheme = localStorage.getItem('theme') as Theme | null;

    // If we have a stored theme, update state only if different from default ('dark')
    if (storedTheme === 'light') {
      setTheme('light');
    } else if (!storedTheme) {
      // If no stored theme, we assume 'dark' (as per script default)
      localStorage.setItem('theme', 'dark');
    }

    // Ensure classList matches logical state (safety check)
    // Default is dark unless explicitly 'light'
    if (storedTheme === 'light') {
        document.documentElement.classList.remove('dark');
    } else {
        document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
