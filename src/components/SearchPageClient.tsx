'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchInput, { type SearchInputRef } from '@/components/SearchInput';

export interface SearchableItem {
  /** Unique identifier */
  id: string;
  /** Title/name to search in */
  title: string;
  /** Description to search in */
  description?: string;
  /** Tags to search in and filter by */
  tags?: string[];
  /** Content to search in (optional) */
  content?: string;
  /** Additional data specific to the item type */
  [key: string]: unknown;
}

export interface SearchPageClientProps<T extends SearchableItem> {
  /** All items to search and filter */
  allItems: T[];
  /** Available tags for filtering */
  availableTags: string[];
  /** Initial tag(s) from URL */
  initialTag?: string | string[];
  /** Page title */
  pageTitle: string;
  /** Page subtitle when no filters applied */
  pageSubtitle: string;
  /** Base URL path for navigation (e.g., '/blog', '/projects') */
  basePath: string;
  /** Function to render each item */
  renderItem: (item: T, selectedTags: string[], onTagClick: (tag: string) => void) => React.ReactNode;
  /** Custom empty state component */
  renderEmptyState?: (hasFilters: boolean, onClearFilters: () => void) => React.ReactNode;
  /** Placeholder text for search input */
  searchPlaceholder?: string;
  /** Custom filter description generator */
  getFilterDescription?: (selectedTags: string[]) => string;
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

export default function SearchPageClient<T extends SearchableItem>({ 
  allItems,
  availableTags,
  initialTag,
  pageTitle,
  pageSubtitle,
  basePath,
  renderItem,
  renderEmptyState,
  searchPlaceholder = "Search...",
  getFilterDescription
}: SearchPageClientProps<T>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchInputRef = useRef<SearchInputRef>(null);
  
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
  const [userHasToggledTags, setUserHasToggledTags] = useState(false);
  
  // Calculate tag counts
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allItems.forEach(item => {
      if (item.tags) {
        item.tags.forEach(tag => {
          counts[tag] = (counts[tag] || 0) + 1;
        });
      }
    });
    return counts;
  }, [allItems]);
  
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
    router.replace(`${basePath}${query}`, { scroll: false });
  }, [selectedTags, router, searchParams, basePath]);
  
  // Sort tags alphabetically
  const sortedTags = useMemo(() => {
    return [...availableTags].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  }, [availableTags]);
  
  // Determine which tags to show based on expand state
  const MAX_VISIBLE_TAGS = 20;
  const visibleTags = showAllTags ? sortedTags : sortedTags.slice(0, MAX_VISIBLE_TAGS);
  const hiddenTags = sortedTags.slice(MAX_VISIBLE_TAGS);
  const selectedHiddenCount = selectedTags.filter(tag => hiddenTags.includes(tag)).length;
  
  // Compute filtered items based on both search and tag filter
  const filteredItems = useMemo(() => {
    let items = allItems;
    
    // Apply tag filter first if selected
    if (selectedTags.length > 0) {
      items = items.filter(item => 
        selectedTags.some(selectedTag => item.tags?.includes(selectedTag))
      );
    }
    
    // Then apply search filter if there's a search query
    if (searchQuery.trim()) {
      items = items.filter(item => {
        // Search in title
        if (item.title && fuzzyMatch(searchQuery, item.title)) {
          return true;
        }
        
        // Search in description
        if (item.description && fuzzyMatch(searchQuery, item.description)) {
          return true;
        }
        
        // Search in tags
        if (item.tags && item.tags.some(tag => fuzzyMatch(searchQuery, tag))) {
          return true;
        }
        
        // Search in content (if available)
        if (item.content && fuzzyMatch(searchQuery, item.content)) {
          return true;
        }
        
        return false;
      });
    }
    
    return items;
  }, [allItems, selectedTags, searchQuery]);

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
      // If the selected tag is not in the visible list and user hasn't manually toggled, expand to show it
      if (!showAllTags && !visibleTags.includes(tag) && !userHasToggledTags) {
        setShowAllTags(true);
      }
    }
  }, [selectedTags, showAllTags, visibleTags, userHasToggledTags]);

  // Auto-expand if initial tag is hidden, but only if user hasn't manually toggled
  useEffect(() => {
    if (initialTag && !showAllTags && !userHasToggledTags && sortedTags.length > MAX_VISIBLE_TAGS) {
      const initialTags = Array.isArray(initialTag) ? initialTag : [initialTag];
      const visibleTagsSet = new Set(sortedTags.slice(0, MAX_VISIBLE_TAGS));
      const hasHiddenInitialTag = initialTags.some(tag => !visibleTagsSet.has(tag));
      
      if (hasHiddenInitialTag) {
        setShowAllTags(true);
      }
    }
  }, [initialTag, showAllTags, sortedTags, userHasToggledTags]);

  const clearFilters = useCallback(() => {
    setSelectedTags([]);
    setSearchQuery('');
    searchInputRef.current?.clear();
  }, []);

  // Generate filter description
  const filterDescription = useMemo(() => {
    if (getFilterDescription) {
      return getFilterDescription(selectedTags);
    }
    
    if (selectedTags.length > 0) {
      return selectedTags.length === 1
        ? `Items tagged with "${selectedTags[0]}"`
        : selectedTags.length === 2
        ? `Items tagged with "${selectedTags[0]}" and "${selectedTags[1]}"`
        : `Items tagged with "${selectedTags[0]}", "${selectedTags[1]}" and ${selectedTags.length - 2} more`;
    }
    
    return pageSubtitle;
  }, [selectedTags, pageSubtitle, getFilterDescription]);

  // Default empty state
  const defaultEmptyState = (hasFilters: boolean, _onClearFilters: () => void) => (
    <section className="py-16">
      <div className="flex items-start gap-6 justify-center">
        <svg 
          className="w-12 h-12 text-[var(--color-muted)] flex-shrink-0 mt-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1} 
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
          />
        </svg>
        <div>
          <h2 className="text-2xl font-medium text-[var(--color-text)] mb-2">
            {hasFilters ? 'No Items Found' : 'No Items Yet'}
          </h2>
          <p className="text-[var(--color-muted)] text-lg leading-relaxed">
            {hasFilters
              ? 'No items match your current search or filter criteria.'
              : 'Items will appear here once they are available.'
            }
          </p>
        </div>
      </div>
    </section>
  );

  return (
    <div className="flex-1 px-4 py-8 sm:p-8 md:p-12 pt-16 sm:pt-24 md:pt-32 max-w-4xl mx-auto">
      {/* Header Section */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--color-text)] mb-6">
          {pageTitle}
        </h1>
        <p className="text-xl text-[var(--color-muted)] leading-relaxed">
          {filterDescription}
          {selectedTags.length > 0 && '. Press Escape/click on the tag again to clear filters.'}
        </p>
      </header>

      {/* Search and Filters Section */}
      <section className="mb-12 space-y-4">
        {/* Natural Language Search Bar */}
        <SearchInput 
          ref={searchInputRef}
          placeholder={searchPlaceholder}
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
                  onClick={() => {
                    setShowAllTags(!showAllTags);
                    setUserHasToggledTags(true);
                  }}
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

      {/* Items List */}
      {filteredItems.length > 0 ? (
        <section>
          <div className="space-y-8">
            {filteredItems.map(item => renderItem(item, selectedTags, handleTagClick))}
          </div>
        </section>
      ) : (
        (renderEmptyState || defaultEmptyState)(
          selectedTags.length > 0 || searchQuery.trim() !== '', 
          clearFilters
        )
      )}
    </div>
  );
}
