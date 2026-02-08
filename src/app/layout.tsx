import type { Metadata } from 'next';
import './globals.css';
import MobileNavigation from '@/components/MobileNavigation';
import { Providers } from './providers';
import SharedSidebar from '@/components/SharedSidebar';

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
    <div className="sidebar-desktop">
      <SharedSidebar />
    </div>
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
        <Providers attribute="class" defaultTheme="light">
          {/* Skip link for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--color-primary)] focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            Skip to main content
          </a>

          <div className="flex min-h-screen justify-center overflow-x-hidden">
            <div className="flex max-w-7xl w-full h-screen overflow-hidden">
              {/* Desktop Sidebar */}
              <Sidebar />

              {/* Main Content Area */}
              <main id="main-content" className="flex-1 lg:ml-0 main-content-mobile overflow-y-auto overflow-x-hidden">
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