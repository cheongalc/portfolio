import type { Metadata } from 'next';
import Link from 'next/link';

/**
 * Metadata configuration for the 404 page
 * Provides SEO optimization and social media sharing information
 */
export const metadata: Metadata = {
  title: '404 - Page Not Found | Alistair Cheong',
  description: 'The page you are looking for could not be found.',
  openGraph: {
    title: '404 - Page Not Found | Alistair Cheong',
    description: 'The page you are looking for could not be found.',
    type: 'website',
  },
};

/**
 * Custom 404 Not Found page component
 * 
 * This component provides a user-friendly 404 error page that:
 * - Maintains consistent design with other pages
 * - Follows the current theme (light/dark mode)
 * - Provides helpful navigation options
 * - Uses the same typography and layout patterns
 * 
 * @returns The rendered 404 error page
 */
export default function NotFound() {
  return (
    <div className="flex-1 p-12 pt-32 max-w-4xl mx-auto">
      {/* Header Section */}
      <section className="mb-16">
        <h1 className="text-3xl font-bold text-[var(--color-text)] mb-6">
          404 - Page Not Found
        </h1>
        <p className="text-xl text-[var(--color-muted)] leading-relaxed mb-8">
          The page you are looking for could not be found. It might have been moved, 
          deleted, or you entered the wrong URL.
        </p>
        
        <Link 
          href="/"
          className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors duration-300 text-base"
        >
          ← Back to Home
        </Link>
      </section>
    </div>
  );
}
