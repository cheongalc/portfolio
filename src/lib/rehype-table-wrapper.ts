import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Element, Root } from 'hast';

/**
 * Rehype plugin to wrap tables in a scrollable div container
 * This allows tables to scroll horizontally without affecting page layout
 */
const rehypeTableWrapper: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (node.tagName === 'table' && parent && typeof index === 'number') {
        // Create wrapper div with overflow-x: auto
        const wrapper: Element = {
          type: 'element',
          tagName: 'div',
          properties: {
            className: ['table-wrapper']
          },
          children: [node]
        };
        
        // Replace table with wrapped version
        parent.children[index] = wrapper;
      }
    });
  };
};

export default rehypeTableWrapper;
