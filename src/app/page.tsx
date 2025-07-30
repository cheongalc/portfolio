import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, type PostMetadata } from '@/lib/posts';

/**
 * Metadata configuration for the home page
 * Provides SEO optimization and social media sharing information
 */
export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about my background, research interests, and professional experience in machine learning and artificial intelligence.',
  openGraph: {
    title: 'About - Your Name',
    description: 'Learn about my background, research interests, and professional experience in machine learning and artificial intelligence.',
    type: 'website',
  },
};

/**
 * Home page component that displays personal information and recent work
 * 
 * This component serves as the main landing page, featuring:
 * - Personal introduction and background
 * - Latest publications in vertical layout
 * - Academic and professional experience
 * 
 * @returns The rendered home page with about content and publication listings
 */
export default async function HomePage() {
  try {
    // Fetch all posts and separate by type
    const posts: PostMetadata[] = await getAllPosts();
    
    // Filter publications (academic papers, articles, etc.)
    const publications = posts
      .filter(post => post.type === 'publication')
      .slice(0, 5); // Show more publications on the main page

    return (
      <div className="flex-1 p-12 pt-32 max-w-4xl mx-auto">
        {/* Main Content */}
        <div className="space-y-8 text-gray-300 leading-relaxed">
         <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
        </div>

        {/* Publications Section */}
        {publications.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-gray-100 mb-8">
              Recent Publications
            </h2>
            <div className="space-y-6">
              {publications.map(publication => (
                <article key={publication.slug} className="border-l-2 border-blue-500 pl-6 py-2">
                  <h3 className="text-xl font-medium text-gray-100 mb-2">
                    <Link 
                      href={`/blog/${publication.slug}`}
                      className="hover:text-blue-400 transition-colors"
                    >
                      {publication.title || 'Untitled Publication'}
                    </Link>
                  </h3>
                  {publication.date && (
                    <time className="text-base text-gray-400 mb-2 block">
                      {new Date(publication.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  )}
                  {publication.description && (
                    <p className="text-gray-300 text-base leading-relaxed">
                      {publication.description}
                    </p>
                  )}
                  {publication.tags && publication.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {publication.tags.slice(0, 3).map(tag => (
                        <span 
                          key={tag}
                          className="inline-block px-2 py-1 text-sm bg-neutral-800 text-gray-400 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
            
            <div className="mt-8">
              <Link 
                href="/blog" 
                className="text-blue-400 hover:text-blue-300 transition-colors text-lg underline"
                aria-label="View all research and publications"
              >
                View all research →
              </Link>
            </div>
          </div>
        )}

        {/* Empty State */}
        {publications.length === 0 && (
          <div className="mt-16 text-center">
            <div className="max-w-lg mx-auto">
              <h2 className="text-2xl font-medium text-gray-100 mb-6">
                No Publications Yet
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Research publications and papers will be listed here.
              </p>
              <Link 
                href="/blog" 
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-lg rounded-md hover:bg-blue-700 transition-colors"
              >
                Go to Research
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error loading home page content:', error);
    
    return (
      <div className="flex-1 p-12 pt-32 max-w-4xl mx-auto">
        <div className="text-center py-20">
          <h1 className="text-3xl font-semibold text-gray-100 mb-6">
            Unable to Load Content
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            There was an error loading the content. Please check that your blog directory exists and contains valid Markdown files.
          </p>
          <Link 
            href="/blog" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-lg rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Research Page
          </Link>
        </div>
      </div>
    );
  }
}
