'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import type { ProcessedProject } from '@/lib/projects';
import SearchPageClient, { type SearchableItem } from '@/components/SearchPageClient';

interface ProjectsPageClientProps {
  allProjects: ProcessedProject[];
  availableTags: string[];
}

// Extend ProcessedProject to implement SearchableItem
interface SearchableProject extends SearchableItem {
  // Include all ProcessedProject properties
  id: string;
  name: string;
  dateStart: string;
  dateEnd: string;
  description: string;
  tags: string[];
  links: { text: string; url: string }[];
  year: string;
  dateRange: string;
  processedLinks: { text: string; url: string; isLocal: boolean }[];
  descriptionHtml: string;
  title: string;
}

export default function ProjectsPageClient({ 
  allProjects, 
  availableTags
}: ProjectsPageClientProps) {
  const searchParams = useSearchParams();
  const hasScrolledRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle smooth scrolling to projects using search params (e.g., ?scrollTo=uuid)
  useEffect(() => {
    const scrollToParam = searchParams.get('scrollTo');
    if (!scrollToParam || hasScrolledRef.current) return;
    
    console.log('Setting up scroll for project:', scrollToParam);
    
    // Use MutationObserver to detect when DOM changes (projects get rendered)
    const observer = new MutationObserver(() => {
      const element = document.getElementById(scrollToParam);
      if (element && !hasScrolledRef.current) {
        console.log('Element found via MutationObserver:', element);
        hasScrolledRef.current = true;
        
        // Stop observing
        observer.disconnect();
        
        // Scroll after a small delay to ensure rendering is complete
        setTimeout(() => {
          // Find the scrollable container (the main element)
          const scrollContainer = document.getElementById('main-content');
          if (!scrollContainer) {
            console.log('Main content container not found, falling back to window scroll');
            return;
          }
          
          const elementRect = element.getBoundingClientRect();
          const containerRect = scrollContainer.getBoundingClientRect();
          
          // Calculate the element's position relative to the scrollable container
          const elementTop = elementRect.top - containerRect.top + scrollContainer.scrollTop;
          
          // Calculate offset
          const isMobile = window.innerWidth < 1024;
          const offset = isMobile ? 150 : 80;
          const targetPosition = Math.max(0, elementTop - offset);
          
          console.log('Scrolling container to:', targetPosition);
          
          // Smooth scroll the container
          scrollContainer.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }, 100);
      }
    });
    
    // Start observing for DOM changes
    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true
      });
    }
    
    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [searchParams, allProjects]);

  // Reset scroll flag when search params change
  useEffect(() => {
    hasScrolledRef.current = false;
  }, [searchParams]);

  // Convert projects to searchable items
  const searchableProjects: SearchableProject[] = allProjects.map(project => ({
    ...project,
    title: project.name
  }));

  // Custom filter description for projects
  const getFilterDescription = (selectedTags: string[]) => {
    if (selectedTags.length > 0) {
      return selectedTags.length === 1
        ? `Projects tagged with "${selectedTags[0]}"`
        : selectedTags.length === 2
        ? `Projects tagged with "${selectedTags[0]}" and "${selectedTags[1]}"`
        : `Projects tagged with "${selectedTags[0]}", "${selectedTags[1]}" and ${selectedTags.length - 2} more`;
    }
    return 'A collection of personal projects spanning web development, mobile applications, experimental work, and commissioned projects from my coding journey.';
  };

  // Custom empty state for projects
  const renderEmptyState = (hasFilters: boolean, _onClearFilters: () => void) => (
    <section className="py-16">
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
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
          />
        </svg>
        <div>
          <h2 className="text-2xl font-medium text-[var(--color-text)] mb-2">
            {hasFilters ? 'No Projects Found' : 'No Projects Yet'}
          </h2>
          <p className="text-[var(--color-muted)] text-lg leading-relaxed">
            {hasFilters
              ? 'No projects match your current search or filter criteria.'
              : 'Projects will appear here once they are added to the portfolio.'
            }
          </p>
        </div>
      </div>
    </section>
  );

  // Group projects by year for proper rendering
  const groupedProjects = allProjects.reduce((acc, project) => {
    if (!acc[project.year]) {
      acc[project.year] = [];
    }
    acc[project.year].push(project);
    return acc;
  }, {} as Record<string, ProcessedProject[]>);

  const sortedYears = Object.keys(groupedProjects).sort((a, b) => parseInt(b) - parseInt(a));

  // Render individual project within its year group context
  const renderProject = (project: SearchableProject, selectedTags: string[], onTagClick: (tag: string) => void) => {
    const projectsByYear = groupedProjects[project.year];
    const projectIndex = projectsByYear.findIndex(p => p.id === project.id);
    const isFirstOfYear = projectIndex === 0;
    const isLastOfYear = projectIndex === projectsByYear.length - 1;
    const shouldHaveRule = isFirstOfYear && sortedYears.findIndex(y => y === project.year) > 0;

    return (
      <div key={`${project.year}-${projectIndex}`} id={project.id}>
        {/* Horizontal rule between years */}
        {shouldHaveRule && (
          <hr className="border-[var(--color-border)] my-8" />
        )}
        
        <article className={`space-y-3 ${isLastOfYear ? '' : 'md:pb-6'}`}>
          {/* Desktop layout: year on left, content on right */}
          <div className="md:flex md:items-start md:gap-4">
            {/* Year only visible on desktop */}
            <span className="text-sm text-[var(--color-muted)] font-medium md:min-w-[5rem] hidden md:block">
              {isFirstOfYear ? project.year : ''}
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
                    <button
                      key={tagIndex}
                      onClick={() => onTagClick(tag)}
                      className={`text-xs transition-colors duration-300 relative inline-block group cursor-pointer ${
                        selectedTags.includes(tag)
                          ? 'text-[var(--color-primary)]'
                          : 'text-[var(--color-muted)] hover:text-[var(--color-primary)]'
                      }`}
                    >
                      {tag.toLowerCase()}
                      <span className={`absolute bottom-0 left-0 right-0 h-px transition-colors duration-300 ${
                        selectedTags.includes(tag)
                          ? 'bg-[var(--color-primary)]'
                          : 'bg-[var(--color-border)] group-hover:bg-[var(--color-primary)]'
                      }`}></span>
                    </button>
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
          
          {/* Mobile horizontal rule after each project (except last in each year) */}
          {projectIndex < projectsByYear.length - 1 && (
            <div className="md:hidden">
              <hr className="border-[var(--color-border)] mt-6 mb-6" />
            </div>
          )}
        </article>
      </div>
    );
  };

  return (
    <div ref={containerRef}>
      <SearchPageClient
        allItems={searchableProjects}
        availableTags={availableTags}
        pageTitle="Projects"
        pageSubtitle="A collection of personal projects spanning web development, mobile applications, experimental work, and commissioned projects from my coding journey."
        basePath="/projects"
        renderItem={renderProject}
        renderEmptyState={renderEmptyState}
        searchPlaceholder="Search projects..."
        getFilterDescription={getFilterDescription}
      />
    </div>
  );
}
