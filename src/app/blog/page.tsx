import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, type PostMetadata } from '@/lib/posts';
import BlogPageClient from '@/components/BlogPageClient';

/**
 * Props interface for the BlogPage component
 */
interface BlogPageProps {
  /** URL search parameters for filtering */
  searchParams?: Promise<{
    /** Filter posts by tag - can be single string or array */
    tag?: string | string[];
  }>;
}

/**
 * Metadata configuration for the blog page
 * Provides SEO optimization and social media sharing information
 */
export const metadata: Metadata = {
  title: 'Blog',
  description: 'Personal blog covering AI, computer science, technology, photography, music, and life.',
  openGraph: {
    title: 'Blog',
    description: 'Personal blog covering AI, computer science, technology, photography, music, and life.',
    type: 'website',
  },
};

/**
 * Blog listing page component that displays all blog posts with filtering capabilities
 * 
 * This component provides:
 * - Complete list of all published blog posts
 * - Filtering by tags
 * - Clean layout optimized for reading
 * - Post metadata display (date, description, tags)
 * 
 * @param searchParams - URL parameters for filtering posts
 * @returns The rendered blog page with filtered post listings
 */
export default async function BlogPage({ searchParams }: BlogPageProps) {
  try {
    const resolvedSearchParams = await searchParams;
    const { tag } = resolvedSearchParams ?? {};
    
    // Fetch all posts
    const allPosts: PostMetadata[] = await getAllPosts();
    
    // Get unique tags for filter UI
    const availableTags = [...new Set(allPosts.flatMap(p => p.tags || []))];

    return (
      <BlogPageClient 
        allPosts={allPosts} 
        availableTags={availableTags} 
        initialTag={tag} 
      />
    );
  } catch (error) {
    console.error('Error loading blog page:', error);
    
    return (
      <div className="flex-1 px-4 py-8 sm:p-8 md:p-12 pt-16 sm:pt-24 md:pt-32 max-w-4xl mx-auto">
        <div className="text-center py-20">
          <h1 className="text-3xl font-semibold text-[var(--color-text)] mb-6">
            Unable to Load Blog Posts
          </h1>
          <p className="text-lg text-[var(--color-muted)] mb-8">
            There was an error loading the blog posts. Please check that your blog directory exists and contains valid Markdown files.
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center px-6 py-3 bg-[var(--color-primary)] text-white text-lg rounded-md hover:bg-[var(--color-primary-hover)] transition-colors duration-300"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }
}
