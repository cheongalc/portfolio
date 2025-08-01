import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPost, getAllPosts, type PostMetadata } from '@/lib/posts';

/**
 * Props interface for the PostPage component
 */
interface PostPageProps {
  /** Dynamic route parameters */
  params: Promise<{
    /** The post slug from the URL */
    slug: string;
  }>;
}

/**
 * Force static generation for better performance
 * This ensures all blog posts are pre-rendered at build time
 */
export const dynamic = 'force-static';

/**
 * Generates static paths for all blog posts at build time
 * This enables static generation for dynamic routes
 * 
 * @returns Array of param objects containing post slugs
 * 
 * @example
 * ```tsx
 * // Generates paths like:
 * // [{ slug: 'my-first-post' }, { slug: 'another-post' }]
 * // Which become routes: /blog/my-first-post, /blog/another-post
 * ```
 */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const posts: PostMetadata[] = await getAllPosts();
    return posts.map(post => ({ slug: post.slug }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

/**
 * Generates dynamic metadata for each blog post
 * This provides SEO optimization and social media sharing for individual posts
 * 
 * @param params - The route parameters containing the post slug
 * @returns Metadata object with post-specific information
 */
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await getPost(slug);
    
    if (!post) {
      return {
        title: 'Post Not Found',
        description: 'The requested blog post could not be found.',
      };
    }

    const { frontMatter } = post;
    
    return {
      title: frontMatter.title || 'Untitled Post',
      description: frontMatter.description || 'A blog post from your portfolio.',
      keywords: frontMatter.tags || [],
      authors: [{ name: 'Alistair Cheong' }],
      openGraph: {
        title: frontMatter.title || 'Untitled Post',
        description: frontMatter.description || 'A blog post from your portfolio.',
        type: 'article',
        publishedTime: frontMatter.date,
        authors: ['Alistair Cheong'],
        tags: frontMatter.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: frontMatter.title || 'Untitled Post',
        description: frontMatter.description || 'A blog post from your portfolio.',
      },
    };
  } catch (error) {
    const { slug } = await params;
    console.error(`Error generating metadata for post "${slug}":`, error);
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }
}

/**
 * Individual blog post page component
 * 
 * This component provides:
 * - Full blog post content rendered from MDX
 * - Post metadata display (title, date, tags, type)
 * - Navigation breadcrumbs
 * - Responsive typography and layout
 * - Error handling for missing posts
 * 
 * @param params - Route parameters containing the post slug
 * @returns The rendered blog post page with full content
 * 
 * @example
 * ```tsx
 * // Automatically rendered at routes like:
 * // /blog/my-first-post
 * // /blog/understanding-react-hooks
 * // /blog/academic-paper-2024
 * ```
 */
export default async function PostPage({ params }: PostPageProps) {
  try {
    const { slug } = await params;
    const post = await getPost(slug);
    
    // Handle missing post
    if (!post) {
      notFound();
    }

    const { frontMatter, content, options } = post;

    // Get all posts to find next/previous navigation
    const allPosts = await getAllPosts();
    const sortedPosts = allPosts
      .filter(p => p.type !== 'publication') // Exclude publications from navigation
      .sort((a, b) => {
        if (!a.date || !b.date) return 0;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    
    const currentIndex = sortedPosts.findIndex(p => p.slug === slug);
    const nextPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;
    const prevPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;

    return (
      <div className="flex-1 p-12 pt-32 max-w-4xl mx-auto">
        {/* Article Header - Front Matter */}
        <header className="mb-12">
          {/* Title */}
          <h1 className="text-3xl font-bold text-[var(--color-text)] mb-6 leading-tight">
            {frontMatter.title || 'Untitled Post'}
          </h1>
          
          {/* Date */}
          {frontMatter.date && (
            <div className="mb-4">
              <time 
                dateTime={frontMatter.date}
                className="text-base text-[var(--color-muted)]"
              >
                {new Date(frontMatter.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
          )}

          {frontMatter.description && (
            <p className="text-base text-[var(--color-text)] leading-relaxed mb-6 border-l-4 border-[var(--color-primary)] pl-6">
              {String(frontMatter.description)}
            </p>
          )}

          {/* Tags */}
          {frontMatter.tags && frontMatter.tags.length > 0 && (
            <div className="mb-8">
              <div className="flex flex-wrap gap-3">
                {frontMatter.tags.map(tag => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="text-sm transition-colors duration-300 relative inline-block group cursor-pointer text-[var(--color-muted)] hover:text-[var(--color-primary)]"
                  >
                    {tag}
                    <span className="absolute bottom-0 left-0 right-0 h-px bg-[var(--color-border)] group-hover:bg-[var(--color-primary)] transition-colors duration-300"></span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </header>

        {/* Horizontal Rule */}
        <hr className="border-[var(--color-border)] mb-12" />

        {/* Article Content */}
        <article className="prose-enhanced">
          <MDXRemote source={content} options={options} />
        </article>

        {/* Article Footer */}
        <footer className="mt-20 pt-12 border-t border-[var(--color-border)] transition-colors duration-300">
          {/* Post Navigation */}
          <div className="flex justify-between items-center gap-6">
            {/* Next Post (Newer) */}
            {nextPost ? (
              <Link 
                href={`/blog/${nextPost.slug}`}
                className="flex items-center gap-3 px-6 py-3 bg-[var(--color-background)] text-[var(--color-muted)] rounded-md hover:bg-[var(--color-border)] transition-colors duration-300 group max-w-xs"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-[var(--color-muted)]">Next</div>
                  <div className="text-sm font-medium text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors truncate">
                    {nextPost.title || 'Untitled Post'}
                  </div>
                  {nextPost.date && (
                    <div className="text-xs text-[var(--color-muted)]">
                      {new Date(nextPost.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  )}
                </div>
              </Link>
            ) : (
              <div className="flex items-center gap-3 px-6 py-3 text-[var(--color-muted)] opacity-50 max-w-xs">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <div className="min-w-0 flex-1">
                  <div className="text-xs">Next</div>
                  <div className="text-sm">No next post</div>
                </div>
              </div>
            )}

            {/* Previous Post (Older) */}
            {prevPost ? (
              <Link 
                href={`/blog/${prevPost.slug}`}
                className="flex items-center gap-3 px-6 py-3 bg-[var(--color-background)] text-[var(--color-muted)] rounded-md hover:bg-[var(--color-border)] transition-colors duration-300 group max-w-xs"
              >
                <div className="min-w-0 flex-1 text-right">
                  <div className="text-xs text-[var(--color-muted)]">Previous</div>
                  <div className="text-sm font-medium text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors truncate">
                    {prevPost.title || 'Untitled Post'}
                  </div>
                  {prevPost.date && (
                    <div className="text-xs text-[var(--color-muted)]">
                      {new Date(prevPost.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  )}
                </div>
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
            ) : (
              <div className="flex items-center gap-3 px-6 py-3 text-[var(--color-muted)] opacity-50 max-w-xs">
                <div className="min-w-0 flex-1 text-right">
                  <div className="text-xs">Previous</div>
                  <div className="text-sm">No previous post</div>
                </div>
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        </footer>
      </div>
    );
  } catch (error) {
    const { slug } = await params;
    console.error(`Error loading post "${slug}":`, error);
    
    return (
      <div className="flex-1 p-12 pt-32 max-w-4xl mx-auto">
        <div className="text-center py-20">
          <h1 className="text-3xl font-semibold text-[var(--color-text)] mb-6">
            Post Not Found
          </h1>
          <p className="text-lg text-[var(--color-muted)] mb-8">
            The blog post you're looking for doesn't exist or couldn't be loaded.
          </p>
          <Link 
            href="/blog" 
            className="inline-flex items-center px-6 py-3 bg-[var(--color-primary)] text-white text-lg rounded-md hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }
}
