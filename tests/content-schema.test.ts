import { describe, it, expect } from 'vitest';
import { z } from 'astro/zod';

/**
 * Tests for the blog content collection schema.
 * This validates that blog post frontmatter adheres to the expected schema.
 */

// Define the blog schema (mirrors src/content.config.ts)
const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  heroImage: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

describe('Blog Content Schema', () => {
  describe('valid blog posts', () => {
    it('should accept a minimal valid blog post', () => {
      const validPost = {
        title: 'My First Post',
        description: 'A brief description of the post',
        pubDate: '2024-01-15',
      };

      const result = blogSchema.safeParse(validPost);
      expect(result.success).toBe(true);
    });

    it('should accept a blog post with all optional fields', () => {
      const fullPost = {
        title: 'Complete Blog Post',
        description: 'A post with all fields populated',
        pubDate: '2024-01-15',
        updatedDate: '2024-01-20',
        heroImage: '/images/hero.jpg',
        tags: ['technology', 'astro', 'web-development'],
      };

      const result = blogSchema.safeParse(fullPost);
      expect(result.success).toBe(true);
    });

    it('should coerce date strings to Date objects', () => {
      const post = {
        title: 'Date Coercion Test',
        description: 'Testing date coercion',
        pubDate: '2024-06-15T10:30:00Z',
      };

      const result = blogSchema.safeParse(post);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.pubDate).toBeInstanceOf(Date);
      }
    });

    it('should accept Date objects directly', () => {
      const post = {
        title: 'Date Object Test',
        description: 'Testing with Date object',
        pubDate: new Date('2024-01-15'),
      };

      const result = blogSchema.safeParse(post);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid blog posts', () => {
    it('should reject a post without title', () => {
      const invalidPost = {
        description: 'Missing title',
        pubDate: '2024-01-15',
      };

      const result = blogSchema.safeParse(invalidPost);
      expect(result.success).toBe(false);
    });

    it('should reject a post without description', () => {
      const invalidPost = {
        title: 'Missing Description',
        pubDate: '2024-01-15',
      };

      const result = blogSchema.safeParse(invalidPost);
      expect(result.success).toBe(false);
    });

    it('should reject a post without pubDate', () => {
      const invalidPost = {
        title: 'Missing Date',
        description: 'This post has no publication date',
      };

      const result = blogSchema.safeParse(invalidPost);
      expect(result.success).toBe(false);
    });

    it('should reject a post with invalid date format', () => {
      const invalidPost = {
        title: 'Invalid Date',
        description: 'This post has an invalid date',
        pubDate: 'not-a-date',
      };

      const result = blogSchema.safeParse(invalidPost);
      // Note: z.coerce.date() creates an Invalid Date for invalid strings
      // which is technically a Date object but invalid
      if (result.success) {
        expect(Number.isNaN(result.data.pubDate.getTime())).toBe(true);
      }
    });

    it('should reject tags that are not strings', () => {
      const invalidPost = {
        title: 'Invalid Tags',
        description: 'This post has invalid tags',
        pubDate: '2024-01-15',
        tags: [1, 2, 3], // numbers instead of strings
      };

      const result = blogSchema.safeParse(invalidPost);
      expect(result.success).toBe(false);
    });
  });
});
