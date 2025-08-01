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
    }, 500); // Duration of the animation
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center space-x-2 text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors duration-300 text-base group cursor-pointer"
      disabled={isAnimating}
    >
      <svg
        className={`w-5 h-5 transition-transform duration-300 ${isAnimating ? 'animate-rotate-360' : ''}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        {/* Sun icon - centered at 12,12 */}
        <g
          className={isDarkMode ? (isAnimating ? 'animate-sun-out' : '') : (isAnimating ? 'animate-moon-in' : '')}
          style={{ opacity: isDarkMode ? 1 : 0 }}
        >
          {/* Sun center circle */}
          <circle cx="12" cy="12" r="4" />
          {/* Sun rays */}
          <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </g>
        {/* Moon icon - centered at 12,12 */}
        <path
          className={!isDarkMode ? (isAnimating ? 'animate-sun-out' : '') : (isAnimating ? 'animate-moon-in' : '')}
          d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
          style={{ opacity: isDarkMode ? 0 : 1 }}
        />
      </svg>
      <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
    </button>
  );
};

export default ThemeToggle; 