import type { Metadata } from 'next';
import { getPapersByYear } from '@/lib/papers';

/**
 * Metadata configuration for the papers page
 * Provides SEO optimization and social media sharing information
 */
export const metadata: Metadata = {
  title: 'Papers',
  description: 'Academic publications, research papers, and formal articles.',
  openGraph: {
    title: 'Papers',
    description: 'Academic publications, research papers, and formal articles.',
    type: 'website',
  },
};

/**
 * Papers page component that displays academic publications and research papers
 * 
 * This component serves as the papers landing page, featuring:
 * - Publications organized by year from JSON data
 * - Research papers and academic articles
 * - Links to external resources
 * 
 * @returns The rendered papers page with academic publications
 */
export default async function PapersPage() {
  const papersByYear = await getPapersByYear();

  return (
    <div className="flex-1 px-4 py-8 sm:p-8 md:p-12 pt-16 sm:pt-24 md:pt-32 max-w-4xl mx-auto">
      {/* Header Section */}
      <section className="mb-16">
        <h1 className="text-3xl font-bold text-[var(--color-text)] mb-6">
          Papers
        </h1>
      </section>

      {/* Papers Section - Resume-style Table Layout */}
      <section className="space-y-6">
        {papersByYear.flatMap(({ year, papers }) => 
          papers.map((paper, paperIndex) => {
            // Check if this is the first paper of a new year
            const isFirstOfYear = paperIndex === 0;
            
            // Check if this paper should have a horizontal rule above it
            // (i.e., it's the first paper of a year that's not the very first year)
            const shouldHaveRule = isFirstOfYear && papersByYear.findIndex(y => y.year === year) > 0;
            
            return (
              <div key={`${year}-${paperIndex}`}>
                {/* Horizontal rule between years */}
                {shouldHaveRule && (
                  <hr className="border-[var(--color-border)] my-8" />
                )}
                
                <article className="space-y-3 pb-6">
                  {/* Desktop layout: year on left, content on right */}
                  <div className="md:flex md:items-start md:gap-4">
                    <span className="text-sm text-[var(--color-muted)] font-medium md:min-w-[5rem] hidden md:block">
                      {isFirstOfYear ? year : ''}
                    </span>
                    <div className="flex-1">
                      {/* Paper Title */}
                      <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
                        {paper.title}
                      </h3>
                      
                      {/* Mobile layout: year underneath title */}
                      <span className="text-sm text-[var(--color-muted)] font-medium block md:hidden mb-2">
                        {year}
                      </span>
                      
                      {/* Authors */}
                      <p 
                        className="text-[var(--color-text)] text-sm leading-relaxed mb-2"
                        dangerouslySetInnerHTML={{ __html: paper.authorsHtml }}
                      />
                      
                      {/* Venue */}
                      <p className="text-[var(--color-muted)] text-sm italic mb-3">
                        {paper.venue}
                      </p>
                      
                      {/* Links */}
                      {paper.links && paper.links.length > 0 && (
                        <div className="flex items-center gap-4 flex-wrap">
                          {paper.links.map((link, linkIndex) => {
                            if (!link.url) {
                              // Dead link - styled but not clickable
                              return (
                                <span
                                  key={linkIndex}
                                  className="text-sm text-[var(--color-primary)] cursor-default"
                                >
                                  {link.text}
                                </span>
                              );
                            }
                            // Active link
                            return (
                              <a
                                key={linkIndex}
                                href={link.url}
                                className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors duration-300"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {link.text}
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Mobile horizontal rule after each paper (except last in each year) */}
                  {paperIndex < papers.filter(p => p.year === year).length - 1 && (
                    <div className="md:hidden">
                      <hr className="border-[var(--color-border)] mt-6 mb-6" />
                    </div>
                  )}
                </article>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
} 