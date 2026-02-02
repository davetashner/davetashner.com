/**
 * Utility functions for date formatting and manipulation.
 */

/**
 * Format a date for display in blog posts.
 * @param date - The date to format
 * @returns Formatted date string (e.g., "January 15, 2024")
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a date for RSS feeds (RFC 2822 format).
 * @param date - The date to format
 * @returns RFC 2822 formatted date string
 */
export function formatRssDate(date: Date): string {
  return date.toUTCString();
}

/**
 * Get a human-readable relative time string.
 * @param date - The date to compare against now
 * @returns Relative time string (e.g., "2 days ago", "3 months ago")
 */
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'today';
  } else if (diffDays === 1) {
    return 'yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    return years === 1 ? '1 year ago' : `${years} years ago`;
  }
}

/**
 * Check if a date is in the future.
 * @param date - The date to check
 * @returns True if the date is in the future
 */
export function isFutureDate(date: Date): boolean {
  return date.getTime() > Date.now();
}
