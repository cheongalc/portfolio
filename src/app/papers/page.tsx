import type { Metadata } from 'next';
import { getPapersByYear } from '@/lib/papers';

/**
 * Metadata configuration for the papers page
 * Provides SEO optimization and social media sharing information
 */
export const metadata: Metadata = {
  title: 'Papers - Your Name',
  description: 'Academic publications, research papers, and formal articles. Explore my research contributions in AI, computer vision, and machine learning.',
  openGraph: {
    title: 'Papers - Your Name',
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
    <div className="flex-1 p-12 pt-32 max-w-4xl mx-auto">
      {/* Header Section */}
      <section className="mb-16">
        <h1 className="text-3xl font-bold text-[var(--color-text)] mb-6">
          Papers
        </h1>
      </section>

      {/* Papers Section - Rendered from JSON */}
      <section className="space-y-12">
        {papersByYear.map(({ year, papers }) => (
          <div key={year} className="space-y-6">
            {/* Year Header */}
            <h2 className="text-xl font-bold text-[var(--color-text)] border-b-2 border-[var(--color-border)] pb-2">
              {year}
            </h2>
            
            {/* Papers for this year */}
            <div className="space-y-8">
              {papers.map((paper, index) => (
                <article key={index} className="space-y-3">
                  {/* Paper Title */}
                  <h3 className="text-lg font-semibold text-[var(--color-text)]">
                    <a 
                      href={paper.titleLink}
                      className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {paper.title}
                    </a>
                  </h3>
                  
                  {/* Authors */}
                  <p 
                    className="text-[var(--color-text)] text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: paper.authorsHtml }}
                  />
                  
                  {/* Venue */}
                  <p className="text-[var(--color-muted)] text-sm italic">
                    {paper.venue}
                  </p>
                  
                  {/* Links */}
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
          </div>
        ))}
      </section>
    </div>
  );
} 