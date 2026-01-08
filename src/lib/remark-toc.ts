/**
 * Remark plugin to handle table of contents and internal wiki-style links
 * 
 * Features:
 * 1. Replaces [table-of-contents] with a generated TOC based on headings
 * 2. Converts [[#heading]] to internal anchor links
 * 3. Converts [[#heading|alias]] to internal anchor links with custom text
 * 4. Adds IDs to all headings for anchor navigation
 */

import { visit } from 'unist-util-visit';
import type { Root, Heading, Text, Paragraph, PhrasingContent, List, ListItem, Link as MdastLink } from 'mdast';
import { toString } from 'mdast-util-to-string';
import type { Data } from 'unist';

interface HeadingNode extends Heading {
  children: PhrasingContent[];
}

interface HProperties {
  id?: string;
  className?: string;
}

interface TocEntry {
  depth: number;
  text: string;
  id: string;
  children: PhrasingContent[];
}

function clonePhrasingContent(children: PhrasingContent[]): PhrasingContent[] {
  return JSON.parse(JSON.stringify(children));
}

/**
 * Converts heading text to a URL-friendly slug
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores with single dash
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
}

/**
 * Extracts headings from the markdown AST
 */
function extractHeadings(tree: Root): TocEntry[] {
  const headings: TocEntry[] = [];
  
  visit(tree, 'heading', (node: HeadingNode) => {
    const text = toString(node);
    const id = slugify(text);
    const children = clonePhrasingContent(node.children ?? []);
    headings.push({
      depth: node.depth,
      text,
      id,
      children
    });
  });
  
  return headings;
}

/**
 * Generates a table of contents tree structure
 */
function generateTocTree(headings: TocEntry[]): List | Paragraph {
  if (headings.length === 0) {
    return {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          value: 'No headings found.'
        }
      ]
    };
  }

  const tocItems: ListItem[] = headings.map(heading => {
    const link: MdastLink = {
      type: 'link',
      url: `#${heading.id}`,
      children: heading.children.length > 0
        ? heading.children
        : [
            {
              type: 'text',
              value: heading.text
            }
          ]
    };

    return {
      type: 'listItem',
      spread: false,
      data: {
        hProperties: {
          className: `toc-item toc-depth-${heading.depth}`
        }
      },
      children: [
        {
          type: 'paragraph',
          children: [link]
        }
      ]
    };
  });

  return {
    type: 'list',
    ordered: false,
    spread: false,
    children: tocItems,
    data: {
      hProperties: {
        className: 'table-of-contents-list'
      }
    }
  };
}

/**
 * Main remark plugin function
 */
export default function remarkToc() {
  return (tree: Root) => {
    const headings = extractHeadings(tree);
    
    // Step 1: Add IDs to all headings
    visit(tree, 'heading', (node: HeadingNode) => {
      const text = toString(node);
      const id = slugify(text);
      
      if (!node.data) {
        node.data = {};
      }
      if (!node.data.hProperties) {
        node.data.hProperties = {};
      }
      (node.data.hProperties as HProperties).id = id;
    });
    
    // Step 2: Replace [table-of-contents] with actual TOC
    visit(tree, 'paragraph', (node: Paragraph, index, parent) => {
      // Check if this paragraph contains only "[table-of-contents]"
      if (node.children.length === 1 && node.children[0].type === 'text') {
        const textNode = node.children[0] as Text;
        if (textNode.value.trim() === '[table-of-contents]') {
          // Replace with TOC heading and list
          const tocHeading: Heading = {
            type: 'heading',
            depth: 1,
            children: [
              {
                type: 'text',
                value: 'Table of Contents'
              }
            ],
            data: {
              hProperties: {
                id: 'table-of-contents',
                className: 'toc-heading'
              }
            }
          };
          
          const tocTree = generateTocTree(headings);
          
          // Replace the paragraph with heading + TOC list
          if (parent && typeof index === 'number') {
            (parent.children as Root['children']).splice(index, 1, tocHeading, tocTree);
          }
        }
      }
    });
    
    // Step 3: Convert wiki-style links [[#heading]] and [[#heading|alias]]
    visit(tree, 'text', (node: Text, index, parent) => {
      if (!parent || typeof index !== 'number') return;
      
      // Regex to match [[#heading]] or [[#heading|alias]]
      const wikiLinkRegex = /\[\[#([^\]|]+)(?:\|([^\]]+))?\]\]/g;
      const text = node.value;
      const matches = [...text.matchAll(wikiLinkRegex)];
      
      if (matches.length === 0) return;
      
      // Split text and create new nodes
      const newNodes: PhrasingContent[] = [];
      let lastIndex = 0;
      
      for (const match of matches) {
        const matchStart = match.index!;
        const matchEnd = matchStart + match[0].length;
        const headingText = match[1].trim();
        const aliasText = match[2]?.trim();
        
        // Add text before the match
        if (matchStart > lastIndex) {
          newNodes.push({
            type: 'text',
            value: text.slice(lastIndex, matchStart)
          });
        }
        
        // Add the link
        const linkId = slugify(headingText);
        newNodes.push({
          type: 'link',
          url: `#${linkId}`,
          children: [
            {
              type: 'text',
              value: aliasText || headingText
            }
          ]
        });
        
        lastIndex = matchEnd;
      }
      
      // Add remaining text after last match
      if (lastIndex < text.length) {
        newNodes.push({
          type: 'text',
          value: text.slice(lastIndex)
        });
      }
      
      // Replace the original text node with the new nodes
      (parent.children as PhrasingContent[]).splice(index, 1, ...newNodes);
    });
  };
}
