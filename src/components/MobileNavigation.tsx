'use client';

import { useState } from 'react';
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

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);

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
      {isMenuOpen && (
        <div
          className="mobile-menu-overlay lg:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar lg:hidden ${isMenuOpen ? 'open' : ''} transition-colors duration-300`}>
        <SharedSidebar isMobile={true} onLinkClick={closeMenu} onClose={closeMenu} />
      </div>
    </>
  );
}
