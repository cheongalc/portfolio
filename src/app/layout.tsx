import type { Metadata } from 'next';
import './globals.css';
import MobileNavigation from '@/components/MobileNavigation';
import { Providers } from './providers';
import ThemeToggle from '@/components/ThemeToggle';

/**
 * Root metadata configuration for the entire application
 * This defines default SEO settings that can be overridden by individual pages
 */
export const metadata: Metadata = {
  title: {
    template: '%s | Alistair Cheong',
    default: 'Alistair Cheong',
  },
  description: 'Machine Learning Researcher',
  keywords: ['machine learning', 'deep learning'],
  authors: [{ name: 'Alistair Cheong' }],
  creator: 'Alistair Cheong',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://alistaircheong.com',
    siteName: 'Alistair Cheong',
    title: 'Alistair Cheong',
    description: 'Machine Learning Researcher',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alistair Cheong',
    description: 'Machine Learning Researcher',
    creator: '@alistaircheong',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification IDs here
    // google: 'your-google-verification-id',
    // yandex: 'your-yandex-verification-id',
  },
};

/**
 * Sidebar component that contains navigation and profile information
 */
function Sidebar() {
  return (
    <aside className="w-80 bg-[var(--color-background)] border-r border-[var(--color-border)] flex flex-col sidebar-desktop ml-16 transition-colors duration-300 sticky top-0 h-screen overflow-y-auto">
      <div className="flex-1 px-8 pt-32 pb-8">
        {/* Profile Section */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-[var(--color-text)] mb-6">
            <a href="/" className="hover:text-[var(--color-primary)] transition-colors">
              Your Name
            </a>
          </h1>
          <p className="text-[var(--color-muted)] text-base mb-6">
            your.email[at]domain.com
          </p>
          
          {/* Social Links */}
          <div className="mb-8">
            <nav className="flex space-x-4" role="navigation" aria-label="Social media links">
              <a 
                href="https://twitter.com/yourusername" 
                className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
                aria-label="Twitter profile"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a 
                href="https://linkedin.com/in/yourusername" 
                className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
                aria-label="LinkedIn profile"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="https://scholar.google.com/citations?user=yourusername" 
                className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
                aria-label="Google Scholar profile"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/>
                </svg>
              </a>
              <a 
                href="https://github.com/yourusername" 
                className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
                aria-label="GitHub profile"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a 
                href="https://instagram.com/yourusername" 
                className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
                aria-label="Instagram profile"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.40s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </nav>
          </div>
          
          {/* Navigation */}
          <nav className="space-y-3" role="navigation" aria-label="Main navigation">
            <a 
              href="/blog" 
              className="block text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors underline text-base"
              aria-label="Blog posts"
            >
              blog
            </a>
            <a 
              href="/papers" 
              className="block text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors underline text-base"
              aria-label="Papers and publications"
            >
              papers
            </a>
            <a 
              href="/projects" 
              className="block text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors underline text-base"
              aria-label="Projects and work"
            >
              projects
            </a>
            <a 
              href="/gallery" 
              className="block text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors underline text-base"
              aria-label="Photo gallery"
            >
              gallery
            </a>
          </nav>
        </div>

        {/* Theme Toggle */}
        <div className="mt-auto">
          <ThemeToggle />
        </div>
      </div>


    </aside>
  );
}

/**
 * Root layout component with responsive sidebar navigation
 * 
 * This component provides:
 * - Desktop: Fixed left sidebar with profile information and navigation positioned center-left
 * - Mobile: Collapsible sidebar with hamburger menu (via MobileNavigation component)
 * - Main content area for pages
 * - Responsive design that adapts to different screen sizes
 * - Consistent layout structure across all pages
 * - Accessibility features and semantic markup
 * 
 * @param children - The page content to be rendered within the layout
 * @returns The complete HTML document structure with responsive sidebar layout
 */
export default function RootLayout({
  children,
}: {
  /** The page content to render within the layout */
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <Providers attribute="class" defaultTheme="dark">
          {/* Skip link for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--color-primary)] focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            Skip to main content
          </a>

          <div className="flex min-h-screen justify-center">
            <div className="flex max-w-7xl w-full h-screen overflow-hidden">
              {/* Desktop Sidebar */}
              <Sidebar />

              {/* Main Content Area */}
              <main id="main-content" className="flex-1 lg:ml-0 main-content-mobile overflow-y-auto">
                {/* Mobile Navigation Component */}
                <MobileNavigation />
                
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
} 