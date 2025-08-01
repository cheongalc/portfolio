import fs from 'node:fs/promises';
import path from 'node:path';
import { processInlineMarkdown } from './markdown';

/**
 * Path to the projects metadata JSON file
 */
const PROJECTS_JSON_PATH = path.join(process.cwd(), 'public/projects/metadata.json');

/**
 * Represents a link associated with a project
 */
export interface ProjectLink {
  /** Display text for the link */
  text: string;
  /** URL for the link */
  url: string;
}

/**
 * Represents a single project
 */
export interface Project {
  /** Unique identifier for the project */
  id: string;
  /** Name of the project */
  name: string;
  /** Start date of the project */
  dateStart: string;
  /** End date of the project (can be "ongoing") */
  dateEnd: string;
  /** Description of the project */
  description: string;
  /** Tags associated with the project */
  tags: string[];
  /** Additional links related to the project */
  links: ProjectLink[];
}

/**
 * Represents projects data structure from JSON
 */
export interface ProjectsData {
  projects: Project[];
}

/**
 * Represents a processed project with computed year information
 */
export interface ProcessedProject extends Project {
  /** Year this project was started */
  year: string;
  /** Formatted date range for display */
  dateRange: string;
  /** Processed links with proper URLs */
  processedLinks: ProcessedProjectLink[];
  /** Description rendered as HTML from markdown */
  descriptionHtml: string;
}

/**
 * Represents a processed project link with resolved URL
 */
export interface ProcessedProjectLink {
  /** Display text for the link */
  text: string;
  /** Resolved URL (either original web URL or constructed local path) */
  url: string;
  /** Whether this is a local file link */
  isLocal: boolean;
}

/**
 * Utility function to process project links and resolve local file paths
 * 
 * @param links - Array of project links
 * @param projectId - ID of the project for constructing local paths
 * @returns Array of processed links with resolved URLs
 */
function processProjectLinks(links: ProjectLink[], projectId: string): ProcessedProjectLink[] {
  return links.map(link => {
    const isWebUrl = link.url.startsWith('http://') || link.url.startsWith('https://');
    
    if (isWebUrl || !link.url) {
      // It's a web URL or empty, return as-is
      return {
        text: link.text,
        url: link.url,
        isLocal: false
      };
    } else {
      // It's a local file, construct the path
      const localPath = `/projects/${projectId}/${link.url}`;
      return {
        text: link.text,
        url: localPath,
        isLocal: true
      };
    }
  });
}

/**
 * Utility function to format date range for display
 * 
 * @param dateStart - Start date string
 * @param dateEnd - End date string (can be "ongoing")
 * @returns Formatted date range string
 */
function formatDateRange(dateStart: string, dateEnd: string): string {
  const startDate = new Date(dateStart);
  const startYear = startDate.getFullYear();
  const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' });
  
  if (dateEnd === 'ongoing') {
    return `${startMonth} ${startYear} - Present`;
  }
  
  const endDate = new Date(dateEnd);
  const endYear = endDate.getFullYear();
  const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });
  
  if (startYear === endYear) {
    if (startMonth === endMonth) {
      return `${startMonth} ${startYear}`;
    }
    return `${startMonth} - ${endMonth} ${startYear}`;
  }
  
  return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
}

/**
 * Retrieves and processes all projects from the JSON file
 * 
 * @returns Promise that resolves to an array of processed projects, sorted by start date (newest first)
 */
export async function getAllProjects(): Promise<ProcessedProject[]> {
  try {
    // Read the JSON file
    const jsonData = await fs.readFile(PROJECTS_JSON_PATH, 'utf8');
    const projectsData: ProjectsData = JSON.parse(jsonData);
    
    // Process projects and add computed fields
    const allProjects: ProcessedProject[] = projectsData.projects.map(project => {
      const startDate = new Date(project.dateStart);
      const endDate = project.dateEnd === 'ongoing' ? new Date() : new Date(project.dateEnd);
      const year = endDate.getFullYear().toString();
      
      // Process description markdown to HTML
      const descriptionHtml = processInlineMarkdown(project.description);
      
      return {
        ...project,
        year,
        dateRange: formatDateRange(project.dateStart, project.dateEnd),
        processedLinks: processProjectLinks(project.links, project.id),
        descriptionHtml
      };
    });
    
    // Sort by end date (newest first)
    allProjects.sort((a, b) => {
      const endDateA = a.dateEnd === 'ongoing' ? new Date() : new Date(a.dateEnd);
      const endDateB = b.dateEnd === 'ongoing' ? new Date() : new Date(b.dateEnd);
      return endDateB.getTime() - endDateA.getTime();
    });
    
    return allProjects;
    
  } catch (error) {
    console.error('Error reading projects data:', error);
    return [];
  }
}

/**
 * Retrieves projects organized by year (for rendering year sections)
 * 
 * @returns Promise that resolves to projects data organized by year
 */
export async function getProjectsByYear(): Promise<{ year: string; projects: ProcessedProject[] }[]> {
  const allProjects = await getAllProjects();
  
  // Group projects by year
  const projectsByYear = new Map<string, ProcessedProject[]>();
  
  for (const project of allProjects) {
    if (!projectsByYear.has(project.year)) {
      projectsByYear.set(project.year, []);
    }
    projectsByYear.get(project.year)!.push(project);
  }
  
  // Convert to array and sort years descending
  const sortedYears = Array.from(projectsByYear.keys()).sort((a, b) => parseInt(b) - parseInt(a));
  
  return sortedYears.map(year => ({
    year,
    projects: projectsByYear.get(year)!
  }));
}

/**
 * Retrieves the most recent projects (useful for homepage)
 * 
 * @param limit - Maximum number of projects to return (default: 3)
 * @returns Promise that resolves to an array of recent projects
 */
export async function getRecentProjects(limit: number = 3): Promise<ProcessedProject[]> {
  const allProjects = await getAllProjects();
  return allProjects.slice(0, limit);
}

/**
 * Interface for recent projects with total count
 */
export interface RecentProjectsWithCount {
  projects: ProcessedProject[];
  totalCount: number;
}

/**
 * Retrieves recent projects along with total count
 * 
 * @param limit - Maximum number of recent projects to return (default: 3)
 * @returns Promise that resolves to an object with recent projects and total count
 */
export async function getRecentProjectsWithCount(limit: number = 3): Promise<RecentProjectsWithCount> {
  const allProjects = await getAllProjects();
  return {
    projects: allProjects.slice(0, limit),
    totalCount: allProjects.length
  };
}

/**
 * Retrieves all unique tags from projects
 * 
 * @returns Promise that resolves to an array of unique tags
 */
export async function getAllProjectTags(): Promise<string[]> {
  const allProjects = await getAllProjects();
  const tagsSet = new Set<string>();
  
  for (const project of allProjects) {
    for (const tag of project.tags) {
      tagsSet.add(tag);
    }
  }
  
  return Array.from(tagsSet).sort();
}
