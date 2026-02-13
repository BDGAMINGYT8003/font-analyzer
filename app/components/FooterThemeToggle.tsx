'use client';

import { useTheme } from '../context/ThemeContext';
import { motion } from 'motion/react';

import { Theme } from '../context/ThemeContext';

export default function FooterThemeToggle() {
  const { theme, setTheme } = useTheme();

  const tabs: { id: Theme; label: string; icon: React.ReactNode }[] = [
    {
      id: 'system',
      label: 'System',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'light',
      label: 'Light',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      id: 'dark',
      label: 'Dark',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 4h2M20 3v2" />
        </svg>
      )
    },
  ];

  return (
    <div className="flex items-center justify-center p-1 bg-gray-100 dark:bg-zinc-800 rounded-full border border-gray-200 dark:border-zinc-700 w-fit mx-auto mb-8">
      {tabs.map((tab) => {
        const isActive = theme === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setTheme(tab.id)}
            className={`relative px-4 py-1.5 text-xs font-medium rounded-full flex items-center gap-2 transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:focus-visible:ring-zinc-500 ${
              isActive ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            aria-label={`Switch to ${tab.label} theme`}
            aria-current={isActive ? 'true' : undefined}
          >
            {isActive && (
              <motion.div
                layoutId="theme-active"
                className="absolute inset-0 bg-white dark:bg-zinc-700 rounded-full shadow-sm"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                style={{ zIndex: 0 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon}
              <span>{tab.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
