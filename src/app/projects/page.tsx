import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllProjects, getAllProjectTags } from '@/lib/projects';
import ProjectsPageClient from '@/components/ProjectsPageClient';

/**
 * Props interface for the ProjectsPage component
 */
interface ProjectsPageProps {
  /** URL search parameters for filtering */
  searchParams?: Promise<{
    /** Filter projects by tag - can be single string or array */
    tag?: string | string[];
  }>;
}

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
 * - Search and filtering capabilities
 * 
 * @returns The rendered projects page with personal projects
 */
export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  try {
    const resolvedSearchParams = await searchParams;
    const { tag } = resolvedSearchParams ?? {};
    
    // Fetch all projects
    const allProjects = await getAllProjects();
    
    // Get unique tags for filter UI
    const availableTags = await getAllProjectTags();

    return (
      <ProjectsPageClient 
        allProjects={allProjects} 
        availableTags={availableTags} 
        initialTag={tag} 
      />
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
