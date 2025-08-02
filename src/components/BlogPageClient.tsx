'use client';

import Link from 'next/link';
import type { PostMetadata } from '@/lib/posts';
import SearchPageClient, { type SearchableItem } from '@/components/SearchPageClient';

interface BlogPageClientProps {
  allPosts: PostMetadata[];
  availableTags: string[];
  initialTag?: string | string[];
}

// Extend PostMetadata to implement SearchableItem
interface SearchablePost extends PostMetadata, SearchableItem {
  id: string;
  title: string;
}

export default function BlogPageClient({ 
  allPosts, 
  availableTags, 
  initialTag 
}: BlogPageClientProps) {
  // Convert posts to searchable items
  const searchablePosts: SearchablePost[] = allPosts.map(post => ({
    ...post,
    id: post.slug,
    title: post.title || 'Untitled Post'
  }));

  // Custom filter description for posts
  const getFilterDescription = (selectedTags: string[]) => {
    if (selectedTags.length > 0) {
      return selectedTags.length === 1
        ? `Posts tagged with "${selectedTags[0]}"`
        : selectedTags.length === 2
        ? `Posts tagged with "${selectedTags[0]}" and "${selectedTags[1]}"`
        : `Posts tagged with "${selectedTags[0]}", "${selectedTags[1]}" and ${selectedTags.length - 2} more`;
    }
    return 'Writing about AI, computer science, technology, photography, music, and life.';
  };

  // Custom empty state for posts
  const renderEmptyState = (hasFilters: boolean, onClearFilters: () => void) => (
    <section className="py-16">
      <div className="text-center">
        <div className="mb-8">
          <svg 
            className="w-16 h-16 mx-auto text-[var(--color-muted)] mb-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1} 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
          <h2 className="text-2xl font-medium text-[var(--color-text)] mb-3">
            {hasFilters ? 'No Posts Found' : 'No Posts Yet'}
          </h2>
          <p className="text-[var(--color-muted)] text-lg max-w-md mx-auto leading-relaxed">
            {hasFilters
              ? 'No posts match your current search or filter criteria. Try adjusting your filters or search terms.'
              : 'Blog posts will appear here once they are published.'
            }
          </p>
        </div>
        {hasFilters && (
          <div className="space-y-3">
            <button 
              onClick={onClearFilters}
              className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors duration-300 font-medium"
            >
              Clear all filters
            </button>
            <div className="text-sm text-[var(--color-muted)]">
              or <Link href="/blog" className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors duration-300">browse all posts</Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );

  // Render individual post
  const renderPost = (post: SearchablePost, selectedTags: string[], onTagClick: (tag: string) => void) => (
    <article key={post.slug} className="space-y-3 border-b border-[var(--color-border)] pb-8 last:border-b-0">
      {/* Desktop layout: date on left, content on right */}
      <div className="md:flex md:items-start md:gap-4">
        <time className="text-sm text-[var(--color-muted)] font-medium md:min-w-[6rem] hidden md:block">
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
          
          {/* Mobile layout: date underneath title */}
          <time className="text-sm text-[var(--color-muted)] font-medium block md:hidden mb-2">
            {post.date && new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </time>
          
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
                  onClick={() => onTagClick(postTag)}
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
  );

  return (
    <SearchPageClient
      allItems={searchablePosts}
      availableTags={availableTags}
      initialTag={initialTag}
      pageTitle="Blog"
      pageSubtitle="Writing about AI, computer science, technology, photography, music, and life."
      basePath="/blog"
      renderItem={renderPost}
      renderEmptyState={renderEmptyState}
      searchPlaceholder="Search posts..."
      getFilterDescription={getFilterDescription}
    />
  );
}
