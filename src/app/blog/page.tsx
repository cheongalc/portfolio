import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, type PostMetadata } from '@/lib/posts';
import SearchInput from '@/components/SearchInput';

/**
 * Props interface for the BlogPage component
 */
interface BlogPageProps {
  /** URL search parameters for filtering */
  searchParams?: Promise<{
    /** Filter posts by type (e.g., 'publication', 'article') */
    type?: string;
    /** Filter posts by tag */
    tag?: string;
  }>;
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
    const resolvedSearchParams = await searchParams;
    const { type, tag } = resolvedSearchParams ?? {};
    
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
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-[var(--color-text)] mb-6">
            Blog
          </h1>
          <p className="text-xl text-[var(--color-muted)] leading-relaxed">
            {type === 'publication' 
              ? 'Academic publications, research papers, and formal articles.'
              : tag
              ? `Posts tagged with "${tag}"`
              : 'Writing on AI, computer science, technology, photography, music, and life.'
            }
          </p>
        </header>

        {/* Search and Filters Section */}
        <section className="mb-12 space-y-4">
          {/* Natural Language Search Bar */}
          <SearchInput />

          {/* Filter Controls */}
          <div className="flex flex-wrap items-start gap-6">
            {/* Type Filters */}
            {availableTypes.length > 1 && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-[var(--color-text)]">Type:</span>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/blog"
                    className={`px-3 py-1 text-sm transition-colors relative ${
                      !type 
                        ? 'text-[var(--color-primary)]' 
                        : 'text-[var(--color-muted)] hover:text-[var(--color-primary)]'
                    }`}
                  >
                    All ({allPosts.length})
                    {!type && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"></span>}
                  </Link>
                  {availableTypes.map(availableType => {
                    const count = allPosts.filter(p => p.type === availableType).length;
                    return (
                      <Link
                        key={String(availableType)}
                        href={`/blog?type=${availableType}`}
                        className={`px-3 py-1 text-sm transition-colors capitalize relative ${
                          type === availableType 
                            ? 'text-[var(--color-primary)]' 
                            : 'text-[var(--color-muted)] hover:text-[var(--color-primary)]'
                        }`}
                      >
                        {String(availableType)} ({count})
                        {type === availableType && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"></span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tag Filters */}
            {availableTags.length > 0 && (
              <div className="flex items-center gap-3 flex-1">
                <span className="text-sm font-medium text-[var(--color-text)]">Tags:</span>
                <div className="flex flex-wrap gap-x-3 gap-y-2 max-w-3xl">
                  {availableTags.slice(0, 12).map(availableTag => (
                    <Link
                      key={availableTag}
                      href={`/blog?tag=${availableTag}`}
                      className={`text-sm transition-colors relative inline-block ${
                        tag === availableTag 
                          ? 'text-[var(--color-primary)]' 
                          : 'text-[var(--color-muted)] hover:text-[var(--color-primary)]'
                      }`}
                    >
                      {availableTag}
                      {tag === availableTag && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"></span>}
                    </Link>
                  ))}
                  {availableTags.length > 12 && (
                    <span className="text-sm text-[var(--color-muted)]">
                      +{availableTags.length - 12} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Posts List - Clean List Layout */}
        {posts.length > 0 ? (
          <section>
            <div className="space-y-8">
              {posts.map(post => (
                <article key={post.slug} className="space-y-3 border-b border-[var(--color-border)] pb-8 last:border-b-0">
                  <div className="flex items-start gap-4">
                    <time className="text-sm text-[var(--color-muted)] font-medium min-w-[6rem]">
                      {post.date && new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </time>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-semibold text-[var(--color-text)]">
                          <Link 
                            href={`/blog/${post.slug}`}
                            className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
                          >
                            {post.title || 'Untitled Post'}
                          </Link>
                        </h2>
                        {post.type && post.type !== 'article' ? (
                          <span className="px-2 py-1 bg-[var(--color-primary)] text-white rounded text-xs uppercase font-medium">
                            {String(post.type)}
                          </span>
                        ) : null}
                      </div>
                      
                      {post.description && (
                        <p className="text-[var(--color-muted)] leading-relaxed text-base mb-3">
                          {post.description}
                        </p>
                      )}
                      
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-3">
                          {post.tags.map(postTag => (
                            <Link
                              key={postTag}
                              href={`/blog?tag=${postTag}`}
                              className="text-xs text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors relative inline-block group"
                            >
                              {postTag}
                              <span className="absolute bottom-0 left-0 right-0 h-px bg-[var(--color-border)] group-hover:bg-[var(--color-primary)] transition-colors"></span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
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
                  className="inline-flex items-center px-6 py-3 bg-[var(--color-primary)] text-white text-lg rounded-md hover:bg-[var(--color-primary-hover)] transition-colors"
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
            className="inline-flex items-center px-6 py-3 bg-[var(--color-primary)] text-white text-lg rounded-md hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }
}
