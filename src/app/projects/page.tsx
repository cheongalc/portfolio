import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { getAllProjects, getAllProjectTags } from '@/lib/projects';
import ProjectsPageClient from '@/components/ProjectsPageClient';

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
 * - Search and filtering capabilities (handled client-side)
 * 
 * @returns The rendered projects page with personal projects
 */
export default async function ProjectsPage() {
  try {
    // Fetch all projects
    const allProjects = await getAllProjects();
    
    // Get unique tags for filter UI
    const availableTags = await getAllProjectTags();

    return (
      <Suspense fallback={
        <div className="flex-1 px-4 py-8 sm:p-8 md:p-12 pt-16 sm:pt-24 md:pt-32 max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      }>
        <ProjectsPageClient 
          allProjects={allProjects} 
          availableTags={availableTags} 
        />
      </Suspense>
    );
  } catch (error) {
    console.error('Error loading projects page:', error);
    
    return (
      <div className="flex-1 px-4 py-8 sm:p-8 md:p-12 pt-16 sm:pt-24 md:pt-32 max-w-4xl mx-auto">
        <div className="text-center py-20">
          <h1 className="text-3xl font-semibold text-[var(--color-text)] mb-6">
            Unable to Load Projects
          </h1>
          <p className="text-lg text-[var(--color-muted)] mb-8">
            There was an error loading the projects. Please check that your projects directory exists and contains valid data.
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center px-6 py-3 bg-[var(--color-primary)] text-white text-lg rounded-md hover:bg-[var(--color-primary-hover)] transition-colors duration-300"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }
}
