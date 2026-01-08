import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkProjectLinks from './remark-project-links';
import remarkBlogImages from './remark-blog-images';
import remarkToc from './remark-toc';
import rehypeCitation from 'rehype-citation';
import type { Pluggable } from 'unified';

/**
 * Directory path where blog posts are stored
 */
const BLOG_DIR = path.join(process.cwd(), 'public/blog');

/**
 * Represents the structure of a blog post's frontmatter metadata
 */
export interface PostMetadata {
  /** Unique identifier for the post (filename without extension) */
  slug: string;
  /** Post title */
  title?: string;
  /** Publication date */
  date?: string;
  /** Post description/excerpt */
  description?: string;
  /** Whether the post is a draft (drafts are filtered out) */
  draft?: boolean;
  /** Post tags/categories */
  tags?: string[];
  /** Post content for search purposes */
  content?: string;
  /** Any additional frontmatter fields */
  [key: string]: unknown;
}

/**
 * Represents a processed blog post with compiled MDX content
 */
export interface ProcessedPost {
  /** Post metadata from frontmatter */
  frontMatter: PostMetadata;
  /** Raw markdown content for RSC MDXRemote */
  content: string;
  /** MDX options for RSC MDXRemote */
  options: {
    mdxOptions: {
      remarkPlugins: Pluggable[];
      rehypePlugins: Pluggable[];
    };
  };
}

/**
 * Retrieves metadata for all published blog posts in the directory
 * 
 * @returns Promise that resolves to an array of all published posts' metadata, sorted by date (newest first)
 */
export async function getAllPosts(): Promise<PostMetadata[]> {
  try {
    // Read all files in the blog directory
    const files = await fs.readdir(BLOG_DIR);
    
    // Filter for markdown files and process each one in parallel
    const posts = await Promise.all(
      files
        .filter(file => file.endsWith('.md'))
        .map(async (filename) => {
          // Read the raw markdown content
          const raw = await fs.readFile(path.join(BLOG_DIR, filename), 'utf8');
          
          // Parse frontmatter using gray-matter (extracts YAML/metadata from top of file)
          const { data, content } = matter(raw);
          
          // Create slug by removing .md extension and return combined metadata
          return { 
            slug: filename.replace(/\.md$/, ''), 
            content: content, // Include content for search purposes
            ...data 
          } as PostMetadata;
        })
    );
    
    // Filter out draft posts and sort by date (newest first)
    return posts
      .filter(post => !post.draft)
      .sort((a, b) => +new Date(b.date || 0) - +new Date(a.date || 0));
      
  } catch (error) {
    console.error(`Error reading blog posts:`, error);
    return [];
  }
}

/**
 * Retrieves and processes a single blog post by its slug
 * 
 * @param slug - The post identifier (filename without .md extension)
 * @returns Promise that resolves to the processed post with frontmatter and raw content
 */
export async function getPost(slug: string): Promise<ProcessedPost> {
  try {
    // Read the specific markdown file
    const raw = await fs.readFile(path.join(BLOG_DIR, `${slug}.md`), 'utf8');
    
    // Parse frontmatter and content separately
    const { content, data } = matter(raw);

    // Optional bibliography support per-post
    const bibliographyRelativePath = `public/media/blog/${slug}/references.bib`;
    const bibliographyFullPath = path.join(process.cwd(), bibliographyRelativePath);
    const cslRelativePath = 'public/media/blog/ieee.csl';
    const rehypePlugins: Pluggable[] = [
      // Render math equations with KaTeX
      [rehypeKatex, { strict: false }],
      // Syntax highlighting for code blocks
      rehypePrettyCode
    ];

    try {
      await fs.access(bibliographyFullPath);
      rehypePlugins.unshift([
        rehypeCitation,
        {
          bibliography: bibliographyRelativePath,
          path: process.cwd(),
          linkCitations: true,
          // Use numeric bracketed style [1], [2] instead of author-date
          // Local copy of IEEE numeric CSL served at /media/blog/ieee.csl
          csl: cslRelativePath
        }
      ]);
    } catch {
      // No bibliography for this post; skip citation processing
    }

    // Return raw content and options for RSC MDXRemote
    return { 
      frontMatter: { slug, ...data } as PostMetadata,
      content,
      options: {
        mdxOptions: {
          // Remark plugins process the markdown AST
          remarkPlugins: [
            [remarkBlogImages, { slug }], // Transform simple filenames to media paths (must come first)
            remarkToc,                    // Table of contents and wiki-style internal links
            remarkProjectLinks,           // Transform UUID links to project scroll links
            remarkGfm,                   // GitHub Flavored Markdown (tables, strikethrough, etc.)
            remarkMath                   // Math notation support (LaTeX-style)
          ],
          // Rehype plugins process the HTML AST
          rehypePlugins,
        },
      }
    };
    
  } catch (error) {
    console.error(`Error loading post "${slug}":`, error);
    throw new Error(`Failed to load post: ${slug}`);
  }
}

/**
 * Interface for recent posts with total count
 */
export interface RecentPostsWithCount {
  posts: PostMetadata[];
  totalCount: number;
}

/**
 * Retrieves recent posts along with total count
 * 
 * @param limit - Maximum number of recent posts to return (default: 3)
 * @returns Promise that resolves to an object with recent posts and total count
 */
export async function getRecentPostsWithCount(limit: number = 3): Promise<RecentPostsWithCount> {
  const allPosts = await getAllPosts();
  return {
    posts: allPosts.slice(0, limit),
    totalCount: allPosts.length
  };
}
