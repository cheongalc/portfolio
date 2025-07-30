import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, type PostMetadata } from '@/lib/posts';

/**
 * Props interface for the BlogPage component
 */
interface BlogPageProps {
  /** URL search parameters for filtering */
  searchParams?: {
    /** Filter posts by type (e.g., 'publication', 'article') */
    type?: string;
    /** Filter posts by tag */
    tag?: string;
  };
}

/**
 * Metadata configuration for the blog page
 * Provides SEO optimization and social media sharing information
 */
export const metadata: Metadata = {
  title: 'Research',
  description: 'Explore research publications, academic papers, and technical writing on machine learning, artificial intelligence, and related topics.',
  openGraph: {
    title: 'Research - Your Name',
    description: 'Explore research publications, academic papers, and technical writing on machine learning, artificial intelligence, and related topics.',
    type: 'website',
  },
};

/**
 * Force static generation for better performance
 * This ensures the blog page is pre-rendered at build time
 */
export const dynamic = 'force-static';

/**
 * Research/blog listing page component that displays all posts with filtering capabilities
 * 
 * This component provides:
 * - Complete list of all published research and posts
 * - Filtering by post type (publications vs regular posts)
 * - Filtering by tags
 * - Vertical layout optimized for reading
 * - Post metadata display (date, type, tags)
 * 
 * @param searchParams - URL parameters for filtering posts
 * @returns The rendered research page with filtered post listings
 */
export default async function BlogPage({ searchParams }: BlogPageProps) {
  try {
    const { type, tag } = searchParams ?? {};
    
    // Fetch all posts and apply filters
    let posts: PostMetadata[] = await getAllPosts();
    
    // Apply type filter if specified
    if (type) {
      posts = posts.filter(post => post.type === type);
    }
    
    // Apply tag filter if specified
    if (tag) {
      posts = posts.filter(post => post.tags?.includes(tag));
    }

    // Get unique types and tags for filter UI
    const allPosts = await getAllPosts();
    const availableTypes = [...new Set(allPosts.map(p => p.type).filter(Boolean))];
    const availableTags = [...new Set(allPosts.flatMap(p => p.tags || []))];

    return (
      <div className="flex-1 p-12 pt-32 max-w-4xl mx-auto">
        {/* Header Section */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-[var(--color-text)] mb-6">
            Research
          </h1>
          <p className="text-xl text-[var(--color-muted)] leading-relaxed">
            {type === 'publication' 
              ? 'Academic publications, research papers, and formal articles.'
              : tag
              ? `Posts tagged with "${tag}"`
              : 'Publications, research papers, and technical writing on AI, computer vision, and machine learning.'
            }
          </p>
        </header>

        {/* Filters Section */}
        {(availableTypes.length > 1 || availableTags.length > 0) && (
          <section className="mb-12 p-6 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg">
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
              Filter Posts
            </h2>
            
            {/* Type Filters */}
            {availableTypes.length > 1 && (
              <div className="mb-6">
                <h3 className="text-base font-medium text-[var(--color-muted)] mb-3">By Type:</h3>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/blog"
                    className={`px-4 py-2 rounded-md text-base transition-colors ${
                      !type 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-neutral-700 text-[var(--color-muted)] hover:bg-neutral-600 border border-neutral-600'
                    }`}
                  >
                    All ({allPosts.length})
                  </Link>
                  {availableTypes.map(availableType => {
                    const count = allPosts.filter(p => p.type === availableType).length;
                    return (
                      <Link
                        key={availableType}
                        href={`/blog?type=${availableType}`}
                        className={`px-4 py-2 rounded-md text-base transition-colors capitalize ${
                          type === availableType 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-neutral-700 text-[var(--color-muted)] hover:bg-neutral-600 border border-neutral-600'
                        }`}
                      >
                        {availableType} ({count})
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tag Filters */}
            {availableTags.length > 0 && (
              <div>
                <h3 className="text-base font-medium text-[var(--color-muted)] mb-3">By Tag:</h3>
                <div className="flex flex-wrap gap-3">
                  {availableTags.slice(0, 10).map(availableTag => (
                    <Link
                      key={availableTag}
                      href={`/blog?tag=${availableTag}`}
                      className={`px-4 py-2 rounded-md text-base transition-colors ${
                        tag === availableTag 
                          ? 'bg-green-600 text-white' 
                          : 'bg-neutral-700 text-[var(--color-muted)] hover:bg-neutral-600 border border-neutral-600'
                      }`}
                    >
                      {availableTag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Posts List - Vertical Layout */}
        {posts.length > 0 ? (
          <section>
            <div className="space-y-8">
              {posts.map(post => (
                <article 
                  key={post.slug} 
                  className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-8 hover:bg-neutral-750 transition-all duration-200"
                >
                  {/* Post Header */}
                  <header className="mb-4">
                    <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-3">
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="hover:text-[var(--color-primary)] transition-colors"
                      >
                        {post.title || 'Untitled Post'}
                      </Link>
                    </h2>
                    
                    {/* Post Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-base text-[var(--color-muted)]">
                      {post.date && (
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                      )}
                      {post.type && post.type !== 'article' && (
                        <span className="px-3 py-1 bg-blue-600 text-blue-100 rounded-full text-sm uppercase font-medium">
                          {post.type}
                        </span>
                      )}
                    </div>
                  </header>

                  {/* Post Description */}
                  {post.description && (
                    <p className="text-[var(--color-muted)] mb-5 leading-relaxed text-lg">
                      {post.description}
                    </p>
                  )}

                  {/* Post Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <footer className="flex flex-wrap gap-2 pt-2 border-t border-[var(--color-border)]">
                      {post.tags.map(postTag => (
                        <Link
                          key={postTag}
                          href={`/blog?tag=${postTag}`}
                          className="inline-block px-3 py-1 text-sm bg-neutral-700 text-[var(--color-muted)] rounded hover:bg-neutral-600 transition-colors"
                        >
                          #{postTag}
                        </Link>
                      ))}
                    </footer>
                  )}
                </article>
              ))}
            </div>
          </section>
        ) : (
          /* Empty State */
          <section className="text-center py-20">
            <div className="max-w-lg mx-auto">
              <h2 className="text-2xl font-medium text-[var(--color-text)] mb-6">
                {type || tag ? 'No Posts Found' : 'No Posts Yet'}
              </h2>
              <p className="text-lg text-[var(--color-muted)] mb-8">
                {type || tag 
                  ? `No posts match the current filter criteria. Try adjusting your filters or browse all posts.`
                  : 'Research publications and papers will be listed here.'
                }
              </p>
              {(type || tag) && (
                <Link 
                  href="/blog" 
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-lg rounded-md hover:bg-blue-700 transition-colors"
                >
                  View All Posts
                </Link>
              )}
            </div>
          </section>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error loading blog page:', error);
    
    return (
      <div className="flex-1 p-12 pt-32 max-w-4xl mx-auto">
        <div className="text-center py-20">
          <h1 className="text-3xl font-semibold text-[var(--color-text)] mb-6">
            Unable to Load Research Posts
          </h1>
          <p className="text-lg text-[var(--color-muted)] mb-8">
            There was an error loading the research posts. Please check that your blog directory exists and contains valid Markdown files.
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-lg rounded-md hover:bg-blue-700 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }
}
