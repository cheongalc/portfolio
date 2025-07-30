import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
// Remove serialize import - not needed for RSC version
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypePrettyCode from 'rehype-pretty-code';

/**
 * Directory path where blog posts are stored
 * Uses process.cwd() to get the current working directory and joins it with 'public/blog'
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
  [key: string]: any;
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
      remarkPlugins: any[];
      rehypePlugins: any[];
    };
  };
}

/**
 * Retrieves and processes all blog posts from the blog directory
 * 
 * @returns Promise that resolves to an array of post metadata, sorted by date (newest first)
 * @throws Will throw an error if the blog directory cannot be read
 * 
 * @example
 * ```typescript
 * const posts = await getAllPosts();
 * console.log(`Found ${posts.length} published posts`);
 * ```
 */
export async function getAllPosts(): Promise<PostMetadata[]> {
  try {
    // Read all files from the blog directory and filter for .md files only
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
    console.error('Error reading blog posts:', error);
    throw new Error('Failed to load blog posts');
  }
}

/**
 * Retrieves and processes a single blog post by its slug
 * 
 * @param slug - The post identifier (filename without .md extension)
 * @returns Promise that resolves to the processed post with frontmatter and raw content
 * @throws Will throw an error if the post file cannot be found or processed
 * 
 * @example
 * ```typescript
 * const post = await getPost('my-first-post');
 * console.log(post.frontMatter.title);
 * ```
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
