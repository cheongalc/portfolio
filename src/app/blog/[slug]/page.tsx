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

    return (
      <div className="max-w-6xl mx-auto px-8 pt-32 pb-16">
        {/* Breadcrumb Navigation */}
        <nav className="mb-12" aria-label="Breadcrumb">
          <ol className="flex items-center text-base text-[var(--color-muted)]">
            <li>
              <Link 
                href="/" 
                className="hover:text-[var(--color-primary)] transition-colors"
              >
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <Link 
                href="/blog" 
                className="hover:text-[var(--color-primary)] transition-colors"
              >
                Blog
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-[var(--color-text)] font-medium">
                {frontMatter.title || 'Untitled Post'}
              </span>
            </li>
          </ol>
        </nav>

        {/* Article Header */}
        <header className="mb-16">
          <h1 className="text-5xl font-bold text-[var(--color-text)] mb-8 leading-tight">
            {frontMatter.title || 'Untitled Post'}
          </h1>
          
          {/* Article Metadata */}
          <div className="flex flex-wrap items-center gap-8 text-base text-[var(--color-muted)] mb-8">
            {frontMatter.date && (
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <time dateTime={frontMatter.date}>
                  {new Date(frontMatter.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
            )}
            
            {frontMatter.type && frontMatter.type !== 'article' && (
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm uppercase font-medium">
                  {frontMatter.type}
                </span>
              </div>
            )}
          </div>

          {/* Article Description */}
          {frontMatter.description && (
            <p className="text-2xl text-[var(--color-muted)] leading-relaxed border-l-4 border-[var(--color-primary)] pl-8">
              {frontMatter.description}
            </p>
          )}
        </header>

        {/* Article Content */}
        <article className="prose-enhanced">
          <MDXRemote source={content} options={options} />
        </article>

        {/* Article Footer */}
        <footer className="mt-20 pt-12 border-t border-[var(--color-border)] transition-colors duration-300">
          {/* Tags */}
          {frontMatter.tags && frontMatter.tags.length > 0 && (
            <div className="mb-12">
              <h3 className="text-base font-medium text-[var(--color-text)] mb-4">
                Tagged with:
              </h3>
              <div className="flex flex-wrap gap-3">
                {frontMatter.tags.map(tag => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${tag}`}
                    className="inline-flex items-center px-4 py-2 bg-[var(--color-background)] text-[var(--color-muted)] rounded-full text-base hover:bg-gray-200 transition-colors duration-300"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <Link 
              href="/blog" 
              className="inline-flex items-center px-6 py-3 bg-[var(--color-background)] text-[var(--color-muted)] rounded-md text-lg hover:bg-gray-200 transition-colors duration-300"
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Back to Blog
            </Link>
            
            <div className="text-base text-[var(--color-muted)]">
              Share this post on social media
            </div>
          </div>
        </footer>
      </div>
    );
  } catch (error) {
    const { slug } = await params;
    console.error(`Error loading post "${slug}":`, error);
    
    return (
      <div className="max-w-6xl mx-auto px-8 pt-32 pb-16">
        <div className="text-center py-20">
          <h1 className="text-3xl font-semibold text-[var(--color-text)] mb-6">
            Post Not Found
          </h1>
          <p className="text-lg text-[var(--color-muted)] mb-8">
            The blog post you're looking for doesn't exist or couldn't be loaded.
          </p>
          <Link 
            href="/blog" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-lg rounded-md hover:bg-blue-700 transition-colors"
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
