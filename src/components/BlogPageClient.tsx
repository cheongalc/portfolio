'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { PostMetadata } from '@/lib/posts';
import SearchInput from '@/components/SearchInput';

interface BlogPageClientProps {
  allPosts: PostMetadata[];
  availableTags: string[];
  initialTag?: string | string[];
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
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize selected tags from URL parameters
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    if (initialTag) {
      // Handle both string and array cases
      return Array.isArray(initialTag) ? initialTag : [initialTag];
    }
    
    // Get all 'tag' parameters from URL
    const urlTags = searchParams.getAll('tag');
    return urlTags.length > 0 ? urlTags : [];
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllTags, setShowAllTags] = useState(false);
  
  // Calculate tag counts
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allPosts.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => {
          counts[tag] = (counts[tag] || 0) + 1;
        });
      }
    });
    return counts;
  }, [allPosts]);
  
  // Update URL when selectedTags changes
  useEffect(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    // Remove all existing tag parameters
    current.delete('tag');
    
    // Add current selected tags
    selectedTags.forEach(tag => {
      current.append('tag', tag);
    });
    
    // Update URL without causing page reload
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.replace(`/blog${query}`, { scroll: false });
  }, [selectedTags, router, searchParams]);
  
  // Sort tags alphabetically
  const sortedTags = useMemo(() => {
    return [...availableTags].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  }, [availableTags]);
  
  // Determine which tags to show based on expand state
  const MAX_VISIBLE_TAGS = 20;
  const visibleTags = showAllTags ? sortedTags : sortedTags.slice(0, MAX_VISIBLE_TAGS);
  const hiddenTags = sortedTags.slice(MAX_VISIBLE_TAGS);
  const selectedHiddenCount = selectedTags.filter(tag => hiddenTags.includes(tag)).length;
  
  // Compute filtered posts based on both search and tag filter
  const filteredPosts = useMemo(() => {
    let posts = allPosts;
    
    // Apply tag filter first if selected
    if (selectedTags.length > 0) {
      posts = posts.filter(post => 
        selectedTags.some(selectedTag => post.tags?.includes(selectedTag))
      );
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
  }, [allPosts, selectedTags, searchQuery]);

  const handleSearchResults = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Handle escape key to reset selected tags
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedTags.length > 0) {
        setSelectedTags([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTags]);

  const handleTagClick = useCallback((tag: string) => {
    if (selectedTags.includes(tag)) {
      // If tag is already selected, remove it
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      // If tag is not selected, add it
      setSelectedTags(prev => [...prev, tag]);
      // If the selected tag is not in the visible list, expand to show it
      if (!showAllTags && !visibleTags.includes(tag)) {
        setShowAllTags(true);
      }
    }
  }, [selectedTags, showAllTags, visibleTags]);

  // Auto-expand if initial tag is hidden
  useEffect(() => {
    if (initialTag && !showAllTags && sortedTags.length > MAX_VISIBLE_TAGS) {
      const initialTags = Array.isArray(initialTag) ? initialTag : [initialTag];
      const visibleTagsSet = new Set(sortedTags.slice(0, MAX_VISIBLE_TAGS));
      const hasHiddenInitialTag = initialTags.some(tag => !visibleTagsSet.has(tag));
      
      if (hasHiddenInitialTag) {
        setShowAllTags(true);
      }
    }
  }, [initialTag, showAllTags, sortedTags]);

  return (
    <div className="flex-1 p-12 pt-32 max-w-4xl mx-auto">
      {/* Header Section */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--color-text)] mb-6">
          Blog
        </h1>
        <p className="text-xl text-[var(--color-muted)] leading-relaxed">
          {selectedTags.length > 0
            ? `Posts tagged with ${
                selectedTags.length === 1
                  ? `"${selectedTags[0]}"`
                  : selectedTags.length === 2
                  ? `"${selectedTags[0]}" and "${selectedTags[1]}"`
                  : `"${selectedTags[0]}", "${selectedTags[1]}" and ${selectedTags.length - 2} more`
              }. Press Escape/click on the tag again to clear filters.`
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
        {sortedTags.length > 0 && (
          <div className="flex items-start gap-3">
            <span className="text-sm font-medium text-[var(--color-text)]">Tags:</span>
            <div className="flex-1">
              <div className="flex flex-wrap gap-x-3 gap-y-2 max-w-3xl">
                {visibleTags.map(availableTag => (
                  <button
                    key={availableTag}
                    onClick={() => handleTagClick(availableTag)}
                    className={`text-sm transition-colors duration-300 relative inline-block group cursor-pointer ${
                      selectedTags.includes(availableTag)
                        ? 'text-[var(--color-primary)]' 
                        : 'text-[var(--color-muted)] hover:text-[var(--color-primary)]'
                    }`}
                  >
                    {availableTag} ({tagCounts[availableTag] || 0})
                    <span className={`absolute bottom-0 left-0 right-0 h-px transition-colors duration-300 ${
                      selectedTags.includes(availableTag)
                        ? 'bg-[var(--color-primary)]' 
                        : 'bg-[var(--color-border)] group-hover:bg-[var(--color-primary)]'
                    }`}></span>
                  </button>
                ))}
              </div>
              
              {sortedTags.length > MAX_VISIBLE_TAGS && (
                <button
                  onClick={() => setShowAllTags(!showAllTags)}
                  className="mt-3 text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors duration-300 inline-flex items-center gap-1 cursor-pointer"
                >
                  {showAllTags ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      Show less
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      Show {sortedTags.length - MAX_VISIBLE_TAGS} more
                      {selectedHiddenCount > 0 && (
                        <span className="ml-1 px-2 py-0.5 bg-[var(--color-primary)] text-white text-xs rounded-full">
                          {selectedHiddenCount} selected
                        </span>
                      )}
                    </>
                  )}
                </button>
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
                      <p className="text-[var(--color-text)] leading-relaxed text-base mb-3">
                        {post.description}
                      </p>
                    )}
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-3">
                        {post.tags.map((postTag: string) => (
                          <button
                            key={postTag}
                            onClick={() => handleTagClick(postTag)}
                            className={`text-xs transition-colors duration-300 relative inline-block group cursor-pointer ${
                              selectedTags.includes(postTag)
                                ? 'text-[var(--color-primary)]'
                                : 'text-[var(--color-muted)] hover:text-[var(--color-primary)]'
                            }`}
                          >
                            {postTag}
                            <span className={`absolute bottom-0 left-0 right-0 h-px transition-colors duration-300 ${
                              selectedTags.includes(postTag)
                                ? 'bg-[var(--color-primary)]'
                                : 'bg-[var(--color-border)] group-hover:bg-[var(--color-primary)]'
                            }`}></span>
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
              {selectedTags.length > 0 || searchQuery ? 'No Posts Found' : 'No Posts Yet'}
            </h2>
            <p className="text-lg text-[var(--color-muted)] mb-8">
              {selectedTags.length > 0 || searchQuery
                ? `No posts match the current filter criteria. Try adjusting your filters or browse all posts.`
                : 'Blog posts will be listed here.'
              }
            </p>
            {(selectedTags.length > 0 || searchQuery) && (
              <button 
                onClick={() => {
                  setSelectedTags([]);
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
