'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import type { PostMetadata } from '@/lib/posts';
import SearchInput from '@/components/SearchInput';

interface BlogPageClientProps {
  allPosts: PostMetadata[];
  availableTags: string[];
  initialTag?: string;
}

/**
 * Simple fuzzy text matching function
 * Checks if search terms appear in the target text (case-insensitive)
 */
function fuzzyMatch(searchQuery: string, targetText: string): boolean {
  if (!searchQuery.trim()) return true;
  
  const searchTerms = searchQuery.toLowerCase().split(/\s+/).filter(term => term.length > 0);
  const target = targetText.toLowerCase();
  
  return searchTerms.every(term => target.includes(term));
}

export default function BlogPageClient({ 
  allPosts, 
  availableTags, 
  initialTag 
}: BlogPageClientProps) {
  const [selectedTag, setSelectedTag] = useState<string | undefined>(initialTag);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Compute filtered posts based on both search and tag filter
  const filteredPosts = useMemo(() => {
    let posts = allPosts;
    
    // Apply tag filter first if selected
    if (selectedTag) {
      posts = posts.filter(post => post.tags?.includes(selectedTag));
    }
    
    // Then apply search filter if there's a search query
    if (searchQuery.trim()) {
      posts = posts.filter(post => {
        // Search in title
        if (post.title && fuzzyMatch(searchQuery, post.title)) {
          return true;
        }
        
        // Search in description
        if (post.description && fuzzyMatch(searchQuery, post.description)) {
          return true;
        }
        
        // Search in tags
        if (post.tags && post.tags.some(tag => fuzzyMatch(searchQuery, tag))) {
          return true;
        }
        
        // Search in content (if available)
        if (post.content && fuzzyMatch(searchQuery, post.content)) {
          return true;
        }
        
        return false;
      });
    }
    
    return posts;
  }, [allPosts, selectedTag, searchQuery]);

  const handleSearchResults = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleTagClick = useCallback((tag: string) => {
    if (selectedTag === tag) {
      // If clicking the same tag, deselect it
      setSelectedTag(undefined);
    } else {
      setSelectedTag(tag);
    }
  }, [selectedTag]);

  return (
    <div className="flex-1 p-12 pt-32 max-w-4xl mx-auto">
      {/* Header Section */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--color-text)] mb-6">
          Blog
        </h1>
        <p className="text-xl text-[var(--color-muted)] leading-relaxed">
          {selectedTag
            ? `Posts tagged with "${selectedTag}"`
            : 'Writing about AI, computer science, technology, photography, music, and life.'
          }
        </p>
      </header>

      {/* Search and Filters Section */}
      <section className="mb-12 space-y-4">
        {/* Natural Language Search Bar */}
        <SearchInput 
          onSearchQueryChange={handleSearchResults}
        />

        {/* Filter Controls */}
        {availableTags.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[var(--color-text)]">Tags:</span>
            <div className="flex flex-wrap gap-x-3 gap-y-2 max-w-3xl">
              {availableTags.slice(0, 12).map(availableTag => (
                <button
                  key={availableTag}
                  onClick={() => handleTagClick(availableTag)}
                  className={`text-sm transition-colors duration-300 relative inline-block group ${
                    selectedTag === availableTag 
                      ? 'text-[var(--color-primary)]' 
                      : 'text-[var(--color-muted)] hover:text-[var(--color-primary)]'
                  }`}
                >
                  {availableTag}
                  <span className={`absolute bottom-0 left-0 right-0 h-px transition-colors duration-300 ${
                    selectedTag === availableTag 
                      ? 'bg-[var(--color-primary)]' 
                      : 'bg-[var(--color-border)] group-hover:bg-[var(--color-primary)]'
                  }`}></span>
                </button>
              ))}
              {availableTags.length > 12 && (
                <span className="text-sm text-[var(--color-muted)]">
                  +{availableTags.length - 12} more
                </span>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Posts List - Clean List Layout */}
      {filteredPosts.length > 0 ? (
        <section>
          <div className="space-y-8">
            {filteredPosts.map(post => (
              <article key={post.slug} className="space-y-3 border-b border-[var(--color-border)] pb-8 last:border-b-0">
                <div className="flex items-start gap-4">
                  <time className="text-sm text-[var(--color-muted)] font-medium min-w-[6rem]">
                    {post.date && new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </time>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-semibold text-[var(--color-text)]">
                        <Link 
                          href={`/blog/${post.slug}`}
                          className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors duration-300"
                        >
                          {post.title || 'Untitled Post'}
                        </Link>
                      </h2>
                    </div>
                    
                    {post.description && (
                      <p className="text-[var(--color-muted)] leading-relaxed text-base mb-3">
                        {post.description}
                      </p>
                    )}
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-3">
                        {post.tags.map((postTag: string) => (
                          <button
                            key={postTag}
                            onClick={() => handleTagClick(postTag)}
                            className="text-xs text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors duration-300 relative inline-block group"
                          >
                            {postTag}
                            <span className="absolute bottom-0 left-0 right-0 h-px bg-[var(--color-border)] group-hover:bg-[var(--color-primary)] transition-colors duration-300"></span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        /* Empty State */
        <section className="text-center py-20">
          <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-medium text-[var(--color-text)] mb-6">
              {selectedTag || searchQuery ? 'No Posts Found' : 'No Posts Yet'}
            </h2>
            <p className="text-lg text-[var(--color-muted)] mb-8">
              {selectedTag || searchQuery
                ? `No posts match the current filter criteria. Try adjusting your filters or browse all posts.`
                : 'Blog posts will be listed here.'
              }
            </p>
            {(selectedTag || searchQuery) && (
              <button 
                onClick={() => {
                  setSelectedTag(undefined);
                  setSearchQuery('');
                }}
                className="inline-flex items-center px-6 py-3 bg-[var(--color-primary)] text-white text-lg rounded-md hover:bg-[var(--color-primary-hover)] transition-colors duration-300"
              >
                Clear Filters
              </button>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
