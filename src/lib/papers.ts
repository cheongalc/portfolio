import fs from 'node:fs/promises';
import path from 'node:path';
import { processInlineMarkdown } from './markdown';

/**
 * Path to the papers metadata JSON file
 */
const PAPERS_JSON_PATH = path.join(process.cwd(), 'public/papers/metadata.json');

/**
 * Represents a link associated with a paper
 */
export interface PaperLink {
  /** Display text for the link */
  text: string;
  /** URL for the link */
  url: string;
}

/**
 * Represents a single paper
 */
export interface Paper {
  /** Title of the paper */
  title: string;
  /** Authors string (may contain markdown formatting) */
  authors: string;
  /** Venue where the paper was published */
  venue: string;
  /** Additional links related to the paper */
  links: PaperLink[];
}

/**
 * Represents papers organized by year
 */
export interface PapersData {
  [year: string]: Paper[];
}

/**
 * Represents a processed paper with parsed author information
 */
export interface ProcessedPaper extends Paper {
  /** Year this paper was published */
  year: string;
  /** Processed authors with HTML formatting */
  authorsHtml: string;
}

/**
 * Retrieves and processes all papers from the JSON file
 * 
 * @returns Promise that resolves to an array of processed papers, sorted by year (newest first)
 */
export async function getAllPapers(): Promise<ProcessedPaper[]> {
  try {
    // Read the JSON file
    const jsonData = await fs.readFile(PAPERS_JSON_PATH, 'utf8');
    const papersData: PapersData = JSON.parse(jsonData);
    
    // Convert to flat array with year information and process authors
    const allPapers: ProcessedPaper[] = [];
    
    // Sort years in descending order (newest first)
    const sortedYears = Object.keys(papersData).sort((a, b) => parseInt(b) - parseInt(a));
    
    for (const year of sortedYears) {
      const papers = papersData[year];
      for (const paper of papers) {
        allPapers.push({
          ...paper,
          year,
          authorsHtml: processInlineMarkdown(paper.authors)
        });
      }
    }
    
    return allPapers;
    
  } catch (error) {
    console.error('Error reading papers data:', error);
    return [];
  }
}

/**
 * Retrieves papers organized by year (for rendering year sections)
 * 
 * @returns Promise that resolves to papers data organized by year
 */
export async function getPapersByYear(): Promise<{ year: string; papers: ProcessedPaper[] }[]> {
  try {
    // Read the JSON file
    const jsonData = await fs.readFile(PAPERS_JSON_PATH, 'utf8');
    const papersData: PapersData = JSON.parse(jsonData);
    
    // Sort years in descending order (newest first)
    const sortedYears = Object.keys(papersData).sort((a, b) => parseInt(b) - parseInt(a));
    
    return sortedYears.map(year => ({
      year,
      papers: papersData[year].map(paper => ({
        ...paper,
        year,
        authorsHtml: processInlineMarkdown(paper.authors)
      }))
    }));
    
  } catch (error) {
    console.error('Error reading papers data:', error);
    return [];
  }
}

/**
 * Retrieves the most recent papers (useful for homepage)
 * 
 * @param limit - Maximum number of papers to return (default: 3)
 * @returns Promise that resolves to an array of recent papers
 */
export async function getRecentPapers(limit: number = 3): Promise<ProcessedPaper[]> {
  const allPapers = await getAllPapers();
  return allPapers.slice(0, limit);
}
