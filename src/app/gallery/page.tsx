import type { Metadata } from 'next';

/**
 * Metadata configuration for the gallery page
 * Provides SEO optimization and social media sharing information
 */
export const metadata: Metadata = {
  title: 'Gallery | Alistair Cheong',
  description: 'A compilation of media from the blog, my own photography and music.',
  openGraph: {
    title: 'Gallery | Alistair Cheong',
    description: 'A compilation of media from the blog, my own photography and music.',
    type: 'website',
  },
};

/**
 * Gallery page component that will display media content
 * 
 * This component serves as the gallery landing page, featuring:
 * - Media from blog posts
 * - Personal photography
 * - Music content
 * - Currently under construction
 * 
 * @returns The rendered gallery page
 */
export default function GalleryPage() {
  return (
    <div className="flex-1 p-12 pt-32 max-w-4xl mx-auto">
      {/* Header Section */}
      <section className="mb-16">
        <h1 className="text-3xl font-bold text-[var(--color-text)] mb-6">
          Gallery
        </h1>
        <p className="text-xl text-[var(--color-muted)] leading-relaxed">
          A compilation of media from the blog, my own photography and music.
        </p>
        <p className="text-lg text-[var(--color-muted)] leading-relaxed mt-4">
          This page is currently under construction.
        </p>
      </section>
    </div>
  );
}
