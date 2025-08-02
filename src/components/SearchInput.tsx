'use client';

import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  onSearchQueryChange: (query: string) => void;
}

export interface SearchInputRef {
  clear: () => void;
}

const SearchInput = forwardRef<SearchInputRef, SearchInputProps>(({ 
  placeholder = "Search posts...", 
  className = "",
  onSearchQueryChange
}, ref) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Expose clear method via ref
  useImperativeHandle(ref, () => ({
    clear: () => setSearchQuery('')
  }));

  // Debounced search with 200ms delay
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearchQueryChange(searchQuery);
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, onSearchQueryChange]);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        className={`w-full px-4 py-3 pl-12 text-[var(--color-text)] bg-[var(--color-background)] border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all duration-300 placeholder:text-[var(--color-muted)] ${className}`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg 
          className={`h-5 w-5 transition-colors duration-300 ${
            isFocused ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted)]'
          }`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
});

SearchInput.displayName = 'SearchInput';

export default SearchInput;
