import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypePrettyCode from 'rehype-pretty-code';
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
 * Retrieves and processes all blog posts from the blog directory
 * 
 * @returns Promise that resolves to an array of post metadata, sorted by date (newest first)
 * @throws Will throw an error if the blog directory cannot be read
 */
export async function getAllPosts(): Promise<PostMetadata[]> {
  try {
    // Check if directory exists
    await fs.access(BLOG_DIR);
    
    // Read all files from the directory and filter for .md files only
    const files = (await fs.readdir(BLOG_DIR)).filter(file => file.endsWith('.md'));
    
    // Process each markdown file to extract its frontmatter metadata
    const posts = await Promise.all(
      files.map(async (filename) => {
        // Read the raw markdown content
        const raw = await fs.readFile(path.join(BLOG_DIR, filename), 'utf8');
        
        // Parse frontmatter using gray-matter (extracts YAML/metadata from top of file)
        const { data } = matter(raw);
        
        // Create slug by removing .md extension and return combined metadata
        return { 
          slug: filename.replace(/\.md$/, ''), 
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

    // Return raw content and options for RSC MDXRemote
    return { 
      frontMatter: { slug, ...data } as PostMetadata,
      content,
      options: {
        mdxOptions: {
          // Remark plugins process the markdown AST
          remarkPlugins: [
            remarkGfm,    // GitHub Flavored Markdown (tables, strikethrough, etc.)
            remarkMath    // Math notation support (LaTeX-style)
          ],
          // Rehype plugins process the HTML AST
          rehypePlugins: [
            [rehypeKatex, { strict: false }],  // Render math equations with KaTeX
            rehypePrettyCode                   // Syntax highlighting for code blocks
          ],
        },
      }
    };
    
  } catch (error) {
    console.error(`Error loading post "${slug}":`, error);
    throw new Error(`Failed to load post: ${slug}`);
  }
}
