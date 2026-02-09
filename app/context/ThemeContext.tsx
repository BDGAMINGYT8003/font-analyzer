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

    // If we have a stored theme, update state
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      // If no stored theme, we assume 'dark' (as per script default)
      // but double check if user explicitly prefers light?
      // The request says "Set the website to default to Dark Mode immediately."
      // The script defaults to dark if no storage. So state should be 'dark'.
      // If user manually switched OS to light but hasn't visited site, script respects `prefers-color-scheme`?
      // No, my script ignores `prefers-color-scheme` variable and just checks storage.
      // Wait, let's look at the script logic I wrote:
      /*
        if (!localTheme || localTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      */
      // It forces dark unless 'light' is explicitly stored.
      // So here, if no storedTheme, theme is 'dark'.
      setTheme('dark');
      localStorage.setItem('theme', 'dark'); // Persist the default choice? Or leave empty?
      // Better to leave empty until toggle, but consistency is key.
      // If I don't set it, reloading will re-run script which defaults to dark. Correct.
    }

    // Ensure classList matches state (safety check)
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
