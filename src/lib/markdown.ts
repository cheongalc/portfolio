/**
 * Processes inline markdown content and converts it to HTML
 * This is a lightweight regex-based approach perfect for inline content
 * like author names and project descriptions with basic markdown formatting.
 * 
 * Supports:
 * - **bold** → <strong>bold</strong>
 * - *italic* → <em>italic</em>
 * - `code` → <code>code</code>
 * - [link](url) → <a href="url" class="...">link</a> (styled consistently with site)
 * - \n → <br> (line breaks)
 * 
 * @param content - The markdown content to process
 * @returns HTML string with markdown formatting applied
 */
export function processInlineMarkdown(content: string): string {
  // Handle basic markdown formatting patterns
  let processed = content;
  
  // Convert \n to <br> for line breaks
  processed = processed.replace(/\n/g, '<br>');
  
  // Convert **bold** to <strong>
  processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Convert *italic* to <em> (but not if it's part of **bold**)
  processed = processed.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>');
  
  // Convert `code` to <code>
  processed = processed.replace(/`(.*?)`/g, '<code>$1</code>');
  
  // Convert [link text](url) to <a> with consistent styling
  processed = processed.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g, 
    '<a href="$2" class="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors duration-300" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  
  return processed;
}
