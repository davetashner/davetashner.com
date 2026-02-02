import { describe, it, expect } from 'vitest';
import {
  slugify,
  truncate,
  getReadingTime,
  capitalize,
  toTitleCase,
} from '../../src/utils/strings';

describe('String Utilities', () => {
  describe('slugify', () => {
    it('should convert text to lowercase', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('should replace spaces with hyphens', () => {
      expect(slugify('my blog post')).toBe('my-blog-post');
    });

    it('should remove special characters', () => {
      expect(slugify("What's New? (2024)")).toBe('whats-new-2024');
    });

    it('should handle multiple spaces and hyphens', () => {
      expect(slugify('too   many    spaces')).toBe('too-many-spaces');
    });

    it('should trim leading and trailing whitespace', () => {
      expect(slugify('  padded text  ')).toBe('padded-text');
    });

    it('should remove leading and trailing hyphens', () => {
      expect(slugify('--hyphen-test--')).toBe('hyphen-test');
    });

    it('should handle underscores', () => {
      expect(slugify('snake_case_text')).toBe('snake-case-text');
    });

    it('should handle empty strings', () => {
      expect(slugify('')).toBe('');
    });
  });

  describe('truncate', () => {
    it('should not truncate text shorter than maxLength', () => {
      expect(truncate('short', 10)).toBe('short');
    });

    it('should truncate text longer than maxLength', () => {
      const result = truncate('This is a very long sentence', 15);
      expect(result).toBe('This is a ve...');
      expect(result.length).toBe(15);
    });

    it('should handle maxLength equal to text length', () => {
      expect(truncate('exact', 5)).toBe('exact');
    });

    it('should handle very short maxLength', () => {
      expect(truncate('hello world', 6)).toBe('hel...');
    });

    it('should trim trailing whitespace before ellipsis', () => {
      const result = truncate('word word word', 10);
      expect(result).toBe('word wo...');
    });
  });

  describe('getReadingTime', () => {
    it('should calculate reading time for short text', () => {
      // 100 words at 200 wpm = 1 minute (rounded up)
      const words = Array(100).fill('word').join(' ');
      expect(getReadingTime(words)).toBe(1);
    });

    it('should round up partial minutes', () => {
      // 250 words at 200 wpm = 1.25 minutes, rounded up to 2
      const words = Array(250).fill('word').join(' ');
      expect(getReadingTime(words)).toBe(2);
    });

    it('should use custom words per minute', () => {
      // 100 words at 100 wpm = 1 minute
      const words = Array(100).fill('word').join(' ');
      expect(getReadingTime(words, 100)).toBe(1);
    });

    it('should handle empty text', () => {
      expect(getReadingTime('')).toBe(1); // Empty splits to [''], length 1
    });

    it('should handle single word', () => {
      expect(getReadingTime('hello')).toBe(1);
    });
  });

  describe('capitalize', () => {
    it('should capitalize the first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should preserve the rest of the string', () => {
      expect(capitalize('hello WORLD')).toBe('Hello WORLD');
    });

    it('should handle single character strings', () => {
      expect(capitalize('a')).toBe('A');
    });

    it('should handle empty strings', () => {
      expect(capitalize('')).toBe('');
    });

    it('should handle already capitalized strings', () => {
      expect(capitalize('Hello')).toBe('Hello');
    });
  });

  describe('toTitleCase', () => {
    it('should capitalize major words', () => {
      expect(toTitleCase('the quick brown fox')).toBe('The Quick Brown Fox');
    });

    it('should keep minor words lowercase (except first word)', () => {
      expect(toTitleCase('war and peace')).toBe('War and Peace');
    });

    it('should always capitalize the first word', () => {
      expect(toTitleCase('a tale of two cities')).toBe('A Tale of Two Cities');
    });

    it('should handle single word', () => {
      expect(toTitleCase('hello')).toBe('Hello');
    });

    it('should handle all caps input', () => {
      expect(toTitleCase('THE GREAT GATSBY')).toBe('The Great Gatsby');
    });

    it('should handle articles and prepositions correctly', () => {
      expect(toTitleCase('to kill a mockingbird')).toBe(
        'To Kill a Mockingbird'
      );
    });
  });
});
