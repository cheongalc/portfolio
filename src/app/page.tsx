import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, type PostMetadata } from '@/lib/posts';
import { getRecentPapers } from '@/lib/papers';

/**
 * Metadata configuration for the home page
 * Provides SEO optimization and social media sharing information
 */
export const metadata: Metadata = {
  title: 'Home - Your Name',
  description: 'Welcome to my personal portfolio. Learn about my background and explore my latest blog posts on technology, development, and more.',
  openGraph: {
    title: 'Home - Your Name',
    description: 'Welcome to my personal portfolio. Learn about my background and explore my latest blog posts.',
    type: 'website',
  },
};

/**
 * Home page component that displays personal information and recent blog posts
 * 
 * This component serves as the main landing page, featuring:
 * - About Me section with personal introduction
 * - Latest Posts section with mini cards for recent blog posts
 * 
 * @returns The rendered home page with about content and latest blog posts
 */
export default async function HomePage() {
  try {
    // Fetch all posts and get the latest 3
    const posts: PostMetadata[] = await getAllPosts();
    
    // Get the latest 3 posts (excluding publications)
    const latestPosts = posts
      .filter(post => post.type !== 'publication')
      .slice(0, 3);

    // Get recent papers
    const recentPapers = await getRecentPapers(2);

    return (
      <div className="flex-1 p-12 pt-32 max-w-4xl mx-auto">
        {/* About Me Section */}
        <section className="mb-16">
          <h1 className="text-3xl font-bold text-[var(--color-text)] mb-6">
            About Me
          </h1>
          <div className="space-y-4 text-[var(--color-text)] leading-relaxed text-lg">
            <p>
              Welcome to my digital space! Dummy text
            </p>
            <p>
              More dummy text
            </p>
          </div>
        </section>

        {/* Latest Posts Section */}
        {latestPosts.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-8">
              Latest Posts
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map(post => (
                <article 
                  key={post.slug} 
                  className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-6 hover:border-[var(--color-primary)] transition-all duration-300 group"
                >
                  <h3 className="text-xl font-medium text-[var(--color-text)] mb-3 group-hover:text-[var(--color-primary)] transition-colors">
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="block"
                    >
                      {post.title || 'Untitled Post'}
                    </Link>
                  </h3>
                  
                  {post.date && (
                    <time className="text-sm text-[var(--color-muted)] mb-3 block">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </time>
                  )}
                  
                  {post.description && (
                    <p className="text-[var(--color-text)] text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.description}
                    </p>
                  )}
                  
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 2).map(tag => (
                        <span 
                          key={tag}
                          className="inline-block px-2 py-1 text-xs bg-neutral-800 text-[var(--color-muted)] rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 2 && (
                        <span className="inline-block px-2 py-1 text-xs bg-neutral-800 text-[var(--color-muted)] rounded">
                          +{post.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
            
            {/* View All Posts Link */}
            <div className="mt-12 text-center">
              <Link 
                href="/blog" 
                className="inline-flex items-center px-6 py-3 bg-[var(--color-primary)] text-white text-lg rounded-md hover:bg-[var(--color-primary-hover)] transition-colors"
              >
                View All Posts
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </section>
        )}
        
        {/* Recent Papers Section */}
        {recentPapers.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-8">
              Recent Papers
            </h2>
            
            <div className="space-y-6">
              {recentPapers.map((paper, index) => (
                <article 
                  key={index}
                  className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-6 hover:bg-neutral-750 transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">
                    <a 
                      href={paper.titleLink}
                      className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {paper.title}
                    </a>
                  </h3>
                  
                  <p 
                    className="text-[var(--color-text)] text-sm leading-relaxed mb-2"
                    dangerouslySetInnerHTML={{ __html: paper.authorsHtml }}
                  />
                  
                  <p className="text-[var(--color-muted)] text-sm italic mb-4">
                    {paper.venue}
                  </p>
                  
                  {paper.links && paper.links.length > 0 && (
                    <div className="flex items-center gap-4 flex-wrap">
                      {paper.links.map((link, linkIndex) => (
                        <a
                          key={linkIndex}
                          href={link.url}
                          className="inline-flex items-center text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.text}
                          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
            
            {/* View All Papers Link */}
            <div className="mt-8 text-center">
              <Link 
                href="/papers" 
                className="inline-flex items-center px-6 py-3 bg-[var(--color-primary)] text-white text-lg rounded-md hover:bg-[var(--color-primary-hover)] transition-colors"
              >
                View All Papers
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </section>
        )}
        
        {/* No Posts Fallback */}
        {latestPosts.length === 0 && (
          <section>
            <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-8">
              Latest Posts
            </h2>
            <div className="text-center py-12 border border-[var(--color-border)] rounded-lg">
              <p className="text-[var(--color-muted)] text-lg mb-4">
                No blog posts found yet.
              </p>
              <Link 
                href="/blog" 
                className="inline-flex items-center px-6 py-3 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary-hover)] transition-colors"
              >
                Explore Writing
              </Link>
            </div>
          </section>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error loading home page content:', error);
    
    return (
      <div className="flex-1 p-12 pt-32 max-w-4xl mx-auto">
        <div className="text-center py-20">
          <h1 className="text-3xl font-semibold text-[var(--color-text)] mb-6">
            Unable to Load Content
          </h1>
          <p className="text-lg text-[var(--color-text)] mb-8">
            There was an error loading the content. Please check that your blog directory exists and contains valid Markdown files.
          </p>
          <Link 
            href="/blog" 
            className="inline-flex items-center px-6 py-3 bg-[var(--color-primary)] text-white text-lg rounded-md hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Try Blog Page
          </Link>
        </div>
      </div>
    );
  }
}
