'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDarkMode = theme === 'dark';

  const toggleTheme = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setTimeout(() => {
      setTheme(isDarkMode ? 'light' : 'dark');
      setIsAnimating(false);
    }, 300); // Duration of the animation
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center space-x-2 text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors duration-300 text-base group"
      disabled={isAnimating}
    >
      <svg
        className={`w-5 h-5 transition-transform duration-300 ${isAnimating ? 'animate-rotate-360' : ''}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          className={isDarkMode ? (isAnimating ? 'animate-sun-out' : '') : (isAnimating ? 'animate-moon-in' : '')}
          d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"
          style={{ opacity: isDarkMode ? 1 : 0 }}
        />
        <path
          className={!isDarkMode ? (isAnimating ? 'animate-sun-out' : '') : (isAnimating ? 'animate-moon-in' : '')}
          d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
          style={{ opacity: isDarkMode ? 0 : 1 }}
        />
      </svg>
      <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
    </button>
  );
};

export default ThemeToggle; 