'use client';

import { ThemeProvider } from 'next-themes';
import type { ComponentProps } from 'react';
import { useEffect } from 'react';

export function Providers({ children, ...props }: ComponentProps<typeof ThemeProvider>) {
  useEffect(() => {
    // Enable color transitions after the first render to avoid flash
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('theme-transition');
    }
  }, []);

  return (
    <ThemeProvider {...props}>
      {children}
    </ThemeProvider>
  );
} 