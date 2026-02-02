/**
 * Utility functions for string manipulation.
 */

/**
 * Generate a URL-friendly slug from a string.
 * @param text - The text to slugify
 * @returns URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word characters
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Truncate text to a maximum length, adding ellipsis if truncated.
 * @param text - The text to truncate
 * @param maxLength - Maximum length of the result (including ellipsis)
 * @returns Truncated text
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - 3).trimEnd() + '...';
}

/**
 * Calculate estimated reading time for text content.
 * @param text - The text content
 * @param wordsPerMinute - Reading speed (default: 200 wpm)
 * @returns Estimated reading time in minutes
 */
export function getReadingTime(text: string, wordsPerMinute = 200): number {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Capitalize the first letter of a string.
 * @param text - The text to capitalize
 * @returns Text with first letter capitalized
 */
export function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Convert a string to title case.
 * @param text - The text to convert
 * @returns Text in title case
 */
export function toTitleCase(text: string): string {
  const minorWords = [
    'a',
    'an',
    'the',
    'and',
    'but',
    'or',
    'for',
    'nor',
    'on',
    'at',
    'to',
    'by',
    'of',
  ];

  return text
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      if (index === 0 || !minorWords.includes(word)) {
        return capitalize(word);
      }
      return word;
    })
    .join(' ');
}
