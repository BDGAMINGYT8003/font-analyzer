'use client';

import { useTheme } from '../context/ThemeContext';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export default function ThemeSegmentedControl() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder to avoid hydration mismatch, same structure but static
    return (
        <div className="flex items-center justify-center p-0.5 md:p-1 bg-gray-100 dark:bg-zinc-800/50 rounded-full border border-gray-200 dark:border-zinc-700/50 opacity-0">
             <div className="w-20 md:w-24 h-7 md:h-8"></div>
        </div>
    );
  }

  const options = [
    { id: 'system', icon: <MonitorIcon />, label: 'System' },
    { id: 'light', icon: <SunIcon />, label: 'Light' },
    { id: 'dark', icon: <MoonIcon />, label: 'Dark' },
  ] as const;

  return (
    <div className="inline-flex items-center justify-center p-0.5 md:p-1 bg-gray-100 dark:bg-zinc-800/80 rounded-full border border-gray-200 dark:border-zinc-700/50 shadow-sm relative">
      {options.map((option) => {
        const isActive = theme === option.id;
        return (
          <button
            key={option.id}
            onClick={() => setTheme(option.id)}
            className={`relative z-10 w-8 h-7 md:w-10 md:h-8 flex items-center justify-center text-sm font-medium transition-colors duration-200 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 ${
              isActive
                ? 'text-gray-900 dark:text-gray-100'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            aria-label={`Switch to ${option.label} theme`}
            title={option.label}
          >
            {isActive && (
              <motion.div
                layoutId="activeTheme"
                className="absolute inset-0 bg-white dark:bg-zinc-600 rounded-full shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-20 w-3.5 h-3.5 md:w-4 md:h-4">
              {option.icon}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function MonitorIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      {/* Star/Sparkle */}
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 3l-1 1 1 1 1-1-1-1z" />
    </svg>
  );
}
