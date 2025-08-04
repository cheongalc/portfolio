/**
 * Remark plugin to transform blog image paths automatically
 * 
 * This plugin detects markdown images where the src is just a filename
 * and automatically converts them to the full media path based on the blog post slug.
 * 
 * Example:
 * Input:  ![Golden Gate Bridge](ggbridge.jpg) in lessons-first-time-interning-sfo.md
 * Output: ![Golden Gate Bridge](/media/blog/lessons-first-time-interning-sfo/ggbridge.jpg)
 */

import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Image } from 'mdast';

/**
 * Pattern to match simple filenames (no path separators)
 * Supports common image extensions: jpg, jpeg, png, gif, webp, svg
 */
const SIMPLE_FILENAME_PATTERN = /^[^/\\]+\.(jpg|jpeg|png|gif|webp|svg)$/i;

/**
 * Interface for plugin options
 */
interface BlogImageOptions {
  /** The slug of the current blog post */
  slug?: string;
}

/**
 * Remark plugin that transforms simple image filenames to full media paths
 */
const remarkBlogImages: Plugin<[BlogImageOptions?], Root> = (options = {}) => {
  return (tree: Root) => {
    const { slug } = options;
    
    // If no slug is provided, we can't transform the paths
    if (!slug) {
      return;
    }
    
    // Visit all image nodes in the markdown AST
    visit(tree, 'image', (node: Image) => {
      const url = node.url;
      
      // Check if the URL is just a simple filename (no path)
      if (SIMPLE_FILENAME_PATTERN.test(url)) {
        // Transform simple filename to full media path
        node.url = `/media/blog/${slug}/${url}`;
        
        // Optional: Add a data attribute to indicate this was auto-transformed
        if (!node.data) {
          node.data = {};
        }
        if (!node.data.hProperties) {
          node.data.hProperties = {};
        }
        (node.data.hProperties as any)['data-blog-image'] = 'true';
      }
    });
  };
};

export default remarkBlogImages;
