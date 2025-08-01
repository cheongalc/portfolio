import type { Metadata } from 'next';
import { getProjectsByYear } from '@/lib/projects';

/**
 * Metadata configuration for the projects page
 * Provides SEO optimization and social media sharing information
 */
export const metadata: Metadata = {
  title: 'Projects',
  description: 'Personal projects, web development, mobile apps, and experimental work. Explore my coding journey from web development to AI applications.',
  openGraph: {
    title: 'Projects',
    description: 'Personal projects, web development, mobile apps, and experimental work.',
    type: 'website',
  },
};

/**
 * Projects page component that displays personal projects and development work
 * 
 * This component serves as the projects landing page, featuring:
 * - Projects organized by year from JSON data
 * - Web development, mobile apps, and experimental projects
 * - Links to live demos and source code
 * 
 * @returns The rendered projects page with personal projects
 */
export default async function ProjectsPage() {
  const projectsByYear = await getProjectsByYear();

  return (
    <div className="flex-1 p-12 pt-32 max-w-4xl mx-auto">
      {/* Header Section */}
      <section className="mb-16">
        <h1 className="text-3xl font-bold text-[var(--color-text)] mb-6">
          Projects
        </h1>
        <p className="text-xl text-[var(--color-muted)] text-lg leading-relaxed">
          A collection of personal projects spanning web development, mobile applications, 
          experimental work, and commissioned projects from my coding journey.
        </p>
      </section>

      {/* Projects Section - Resume-style Table Layout */}
      <section className="space-y-6">
        {projectsByYear.flatMap(({ year, projects }) => 
          projects.map((project, projectIndex) => {
            // Check if this is the first project of a new year
            const isFirstOfYear = projectIndex === 0;
            
            // Check if this project should have a horizontal rule above it
            // (i.e., it's the first project of a year that's not the very first year)
            const shouldHaveRule = isFirstOfYear && projectsByYear.findIndex(y => y.year === year) > 0;
            
            return (
              <div key={`${year}-${projectIndex}`}>
                {/* Horizontal rule between years */}
                {shouldHaveRule && (
                  <hr className="border-[var(--color-border)] my-8" />
                )}
                
                <article className="space-y-3 pb-6">
                  <div className="flex items-start gap-4">
                    <span className="text-sm text-[var(--color-muted)] font-medium min-w-[5rem]">
                      {isFirstOfYear ? year : ''}
                    </span>
                    <div className="flex-1">
                      {/* Project Name */}
                      <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
                        {project.name}
                      </h3>
                      
                      {/* Date Range */}
                      <p className="text-[var(--color-muted)] text-sm italic mb-3">
                        {project.dateRange}
                      </p>
                      
                      {/* Description */}
                      <div 
                        className="text-[var(--color-text)] text-sm leading-relaxed mb-3"
                        dangerouslySetInnerHTML={{ __html: project.descriptionHtml }}
                      />
                      
                      {/* Tags */}
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-3 mb-3">
                          {project.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="text-xs text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors duration-300 relative inline-block group cursor-default"
                            >
                              {tag.toLowerCase()}
                              <span className="absolute bottom-0 left-0 right-0 h-px bg-[var(--color-border)] group-hover:bg-[var(--color-primary)] transition-colors duration-300"></span>
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* Links */}
                      {project.processedLinks && project.processedLinks.length > 0 && (
                        <div className="flex items-center gap-4 flex-wrap">
                          {project.processedLinks.map((link, linkIndex) => {
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
                </article>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
