import { visit } from 'unist-util-visit';
import type { Root, Element, Text } from 'hast';

/**
 * Rehype plugin to format citations:
 * 1. Convert URLs in citation text to clickable links
 * 2. Ensure proper formatting of references section
 */
export default function rehypeCitationFormat() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      // Process citation text to convert URLs to links
      if (node.properties?.className && 
          Array.isArray(node.properties.className) && 
          node.properties.className.includes('csl-right-inline')) {
        
        // Process all text nodes to find and convert URLs
        visit(node, 'text', (textNode: Text, index, parent) => {
          if (!parent || typeof index !== 'number') return;
          
          const text = textNode.value;
          // Match URLs in the format "Available: http://..." or "Available: https://..."
          const urlRegex = /(Available: )(https?:\/\/[^\s]+)/g;
          
          let match;
          const newChildren: (Text | Element)[] = [];
          let lastIndex = 0;
          
          while ((match = urlRegex.exec(text)) !== null) {
            // Add text before the URL
            if (match.index > lastIndex) {
              newChildren.push({
                type: 'text',
                value: text.slice(lastIndex, match.index)
              });
            }
            
            // Add "Available: " text
            newChildren.push({
              type: 'text',
              value: match[1]
            });
            
            // Add URL as a link
            newChildren.push({
              type: 'element',
              tagName: 'a',
              properties: {
                href: match[2],
                target: '_blank',
                rel: 'noopener noreferrer'
              },
              children: [{
                type: 'text',
                value: match[2]
              }]
            });
            
            lastIndex = match.index + match[0].length;
          }
          
          // If we found URLs, replace the text node with the new structure
          if (newChildren.length > 0) {
            // Add remaining text after last URL
            if (lastIndex < text.length) {
              newChildren.push({
                type: 'text',
                value: text.slice(lastIndex)
              });
            }
            
            // Replace the text node with our new structure
            parent.children.splice(index, 1, ...newChildren);
          }
        });
      }
    });
  };
}
