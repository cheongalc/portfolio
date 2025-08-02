'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SharedSidebar from './SharedSidebar';

/**
 * Mobile Navigation Component
 * 
 * This client component handles the mobile menu functionality including:
 * - Hamburger menu button
 * - Slide-out sidebar using the shared sidebar component
 * - Overlay backdrop
 * - Menu close functionality
 */
export default function MobileNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMenu = () => {
    console.log('Opening menu...');
    setIsMenuOpen(true);
  };
  
  const closeMenu = () => {
    console.log('Closing menu...');
    setIsMenuOpen(false);
  };

  console.log('isMenuOpen:', isMenuOpen); // Debug log

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between px-4 pt-6 pb-4 border-b border-[var(--color-border)] bg-[var(--color-background)] sticky top-0 z-30 transition-colors duration-300">
        <h1 className="text-xl font-bold text-[var(--color-text)]">
          <Link href="/" className="hover:text-[var(--color-primary)] transition-colors duration-300">Alistair Cheong</Link>
        </h1>
        <button
          className="text-[var(--color-muted)] hover:text-[var(--color-text)] p-2"
          aria-label="Open menu"
          onClick={openMenu}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className="fixed inset-0 bg-black z-40 lg:hidden pointer-events-none"
        style={{
          opacity: isMenuOpen ? 0.5 : 0,
          transition: 'opacity 0.3s ease-in-out',
          pointerEvents: isMenuOpen ? 'auto' : 'none'
        }}
        onClick={closeMenu}
      />

      {/* Mobile Sidebar - Always rendered for smooth animations */}
      <div 
        className="fixed top-0 left-0 bottom-0 w-80 bg-[var(--color-background)] border-r border-[var(--color-border)] z-50 lg:hidden"
        style={{
          transform: `translateX(${isMenuOpen ? '0%' : '-100%'})`,
          transition: 'transform 0.3s ease-in-out',
          willChange: 'transform'
        }}
      >
        <SharedSidebar isMobile={true} onLinkClick={closeMenu} onClose={closeMenu} />
      </div>
    </>
  );
}
