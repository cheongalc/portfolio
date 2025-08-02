import type { Metadata } from 'next';
import Link from 'next/link';
import { getRecentPostsWithCount } from '@/lib/posts';
import { getRecentPapersWithCount } from '@/lib/papers';
import { getRecentProjectsWithCount } from '@/lib/projects';

/**
 * Metadata configuration for the home page
 * Provides SEO optimization and social media sharing information
 */
export const metadata: Metadata = {
  description: 'Welcome to my personal portfolio. Learn about my background and explore my latest blog posts on technology, development, and more.',
  openGraph: {
    title: 'Alistair Cheong',
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
    // Get recent posts with total count
    const { posts: latestPosts, totalCount: totalPosts } = await getRecentPostsWithCount(3);

    // Get recent papers with total count
    const { papers: recentPapers, totalCount: totalPapers } = await getRecentPapersWithCount(3);

    // Get recent projects with total count
    const { projects: recentProjects, totalCount: totalProjects } = await getRecentProjectsWithCount(3);

    return (
      <div className="flex-1 px-4 py-8 sm:p-8 md:p-12 pt-16 sm:pt-24 md:pt-32 max-w-4xl mx-auto">
        {/* About Me Section */}
        <section className="mb-16">
          <h1 className="text-3xl font-bold text-[var(--color-text)] mb-6">
            About Me
          </h1>
          <div className="space-y-4 text-[var(--color-text)] leading-relaxed text-lg">
            <p>
              I am a sophomore at the School of Computer Science, Carnegie Mellon University.
            </p>
            <p>
              I care deeply about ensuring that Artificial Intelligence benefits humanity. My research interests are in meta-learning, open-endedness and scalable oversight.
            </p>
            <p>
              My hometown is Singapore. <a href="https://maps.app.goo.gl/DrPEhnL1zZDdR81A7" className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors">Bak chor mee</a>, ramen, XO fish meehoon and beef rendang are some of my favorite foods. Outside of Computer Science, I enjoy photography (especially astrophotography), music (piano, guitar, <a href="https://www.instagram.com/alc_bbx/" className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors">beatboxing</a>), badminton, and cooking :)
            </p>
          </div>
        </section>

        {/* Recent Posts Section */}
        {latestPosts.length > 0 && (
          <section className="mb-16">
            <h1 className="text-3xl font-semibold text-[var(--color-text)] mb-8">
              Recent Posts
            </h1>
            
            <div className="space-y-6">
              {latestPosts.map(post => (
                <article key={post.slug} className="space-y-2">
                  {/* Desktop layout: date on left, content on right */}
                  <div className="md:flex md:items-start md:gap-4">
                    <time className="text-sm text-[var(--color-muted)] font-medium md:min-w-[5rem] hidden md:block">
                      {post.date && new Date(post.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </time>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[var(--color-text)] leading-tight mb-1">
                        <Link 
                          href={`/blog/${post.slug}`}
                          className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors duration-300"
                        >
                          {post.title || 'Untitled Post'}
                        </Link>
                      </h3>
                      
                      {/* Mobile layout: date underneath title */}
                      <time className="text-sm text-[var(--color-muted)] font-medium block md:hidden mb-2">
                        {post.date && new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </time>
                      
                      {post.description && (
                        <p className="text-[var(--color-muted)] text-sm leading-relaxed line-clamp-2">
                          {post.description}
                        </p>
                      )}
                      
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-2">
                          {post.tags.map(tag => (
                            <Link
                              key={tag}
                              href={`/blog?tag=${encodeURIComponent(tag)}`}
                              className="text-xs text-[var(--color-muted)] border-b border-[var(--color-border)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors duration-300 cursor-pointer"
                            >
                              {tag}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
            
            {/* View All Posts Link */}
            <div className="mt-8">
              <Link 
                href="/blog" 
                className="inline-flex items-center text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors duration-300 font-medium"
              >
                View all posts
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </section>
        )}
        
        {/* Recent Papers Section */}
        {recentPapers.length > 0 && (
          <section className="mb-16">
            <h1 className="text-3xl font-semibold text-[var(--color-text)] mb-8">
              Recent Papers
            </h1>
            
            <div className="space-y-6">
              {recentPapers.map((paper, index) => (
                <article key={index} className="space-y-2">
                  {/* Desktop layout: date on left, content on right */}
                  <div className="md:flex md:items-start md:gap-4">
                    <span className="text-sm text-[var(--color-muted)] font-medium md:min-w-[5rem] hidden md:block">
                      {paper.year}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold leading-tight">
                        {paper.links && paper.links.length > 0 && paper.links[0].url ? (
                          <a 
                            href={paper.links[0].url}
                            className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors duration-300"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {paper.title}
                          </a>
                        ) : (
                          <span className="text-[var(--color-text)]">
                            {paper.title}
                          </span>
                        )}
                      </h3>
                      
                      {/* Mobile layout: date underneath title */}
                      <span className="text-sm text-[var(--color-muted)] font-medium block md:hidden mb-2">
                        {paper.year}
                      </span>
                      
                      <p className="text-[var(--color-muted)] text-sm mt-1">
                        {paper.venue}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            
            {/* View All Papers Link */}
            <div className="mt-8">
              <Link 
                href="/papers" 
                className="inline-flex items-center text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors duration-300 font-medium"
              >
                View all papers
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </section>
        )}
        
        {/* Recent Projects Section */}
        {recentProjects.length > 0 && (
          <section className="mb-16">
            <h1 className="text-3xl font-semibold text-[var(--color-text)] mb-8">
              Recent Projects
            </h1>
            
            <div className="space-y-6">
              {recentProjects.map((project, index) => (
                <article key={index} className="space-y-2">
                  {/* Desktop layout: date on left, content on right */}
                  <div className="md:flex md:items-start md:gap-4">
                    {/* Date only visible on desktop */}
                    <span className="text-sm text-[var(--color-muted)] font-medium md:min-w-[5rem] hidden md:block">
                      {project.year}
                    </span>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-lg font-semibold leading-tight text-[var(--color-text)]">
                        {project.name}
                      </h3>
                      <p className="text-[var(--color-muted)] text-sm">
                        {project.dateRange}
                      </p>
                      <div 
                        className="text-[var(--color-text)] text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: project.descriptionHtml }}
                      />
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.tags.map(tag => (
                            <Link
                              key={tag}
                              href={`/projects?tag=${encodeURIComponent(tag)}`}
                              className="text-xs text-[var(--color-muted)] border-b border-[var(--color-border)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors duration-300 cursor-pointer"
                            >
                              {tag}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
            
            {/* View All Projects Link */}
            <div className="mt-8">
              <Link 
                href="/projects" 
                className="inline-flex items-center text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors duration-300 font-medium"
              >
                View all projects
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </section>
        )}
        
        {/* No Posts Fallback */}
        {latestPosts.length === 0 && (
          <section>
            <h1 className="text-3xl font-semibold text-[var(--color-text)] mb-8">
              Recent Posts
            </h1>
            <div className="py-12">
              <div className="flex items-start gap-6 justify-center">
                <svg 
                  className="w-12 h-12 text-[var(--color-muted)] flex-shrink-0 mt-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
                <div>
                  <h2 className="text-2xl font-medium text-[var(--color-text)] mb-2">
                    No Posts Yet
                  </h2>
                  <p className="text-[var(--color-muted)] text-lg leading-relaxed">
                    Blog posts will appear here once they are published.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error loading home page content:', error);
    
    return (
      <div className="flex-1 px-4 py-8 sm:p-8 md:p-12 pt-16 sm:pt-24 md:pt-32 max-w-4xl mx-auto">
        <div className="py-20">
          <div className="flex items-start gap-6 justify-center">
            <svg 
              className="w-12 h-12 text-[var(--color-muted)] flex-shrink-0 mt-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
            <div>
              <h1 className="text-3xl font-semibold text-[var(--color-text)] mb-2">
                Unable to Load Content
              </h1>
              <p className="text-[var(--color-muted)] text-lg leading-relaxed">
                There was an error loading the content. Please check that your blog directory exists and contains valid Markdown files.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
