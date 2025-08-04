/**
 * Remark plugin to transform project UUID links into proper project scroll links
 * 
 * This plugin detects markdown links where the URL is a hash followed by a UUID 
 * and automatically converts them to project scroll links.
 * 
 * Example:
 * Input:  [Tree Of Life](#970f3fa2-650e-45ca-9d57-bb144390029d)
 * Output: [Tree Of Life](/projects?scrollTo=970f3fa2-650e-45ca-9d57-bb144390029d)
 */

import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Link } from 'mdast';

/**
 * UUID pattern with hash prefix - matches #uuid format
 */
const HASH_UUID_PATTERN = /^#([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;

/**
 * Remark plugin that transforms hash+UUID links to project scroll links
 */
const remarkProjectLinks: Plugin<[], Root> = () => {
  return (tree: Root) => {
    // Visit all link nodes in the markdown AST
    visit(tree, 'link', (node: Link) => {
      const url = node.url;
      
      // Check if the URL is a hash followed by a UUID
      const match = HASH_UUID_PATTERN.exec(url);
      if (match) {
        const uuid = match[1]; // Extract the UUID from the capture group
        
        // Transform hash+UUID to project scroll link
        node.url = `/projects?scrollTo=${uuid}`;
        
        // Optional: Add a data attribute to indicate this is a project link
        // This can be useful for styling or analytics
        if (!node.data) {
          node.data = {};
        }
        if (!node.data.hProperties) {
          node.data.hProperties = {};
        }
        (node.data.hProperties as Record<string, unknown>)['data-project-link'] = 'true';
      }
    });
  };
};

export default remarkProjectLinks;
