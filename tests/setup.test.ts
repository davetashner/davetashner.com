import { describe, it, expect } from 'vitest';

/**
 * Basic test to verify the testing infrastructure is working correctly.
 */

describe('Test Setup', () => {
  it('should run tests successfully', () => {
    expect(true).toBe(true);
  });

  it('should support async tests', async () => {
    const result = await Promise.resolve(42);
    expect(result).toBe(42);
  });

  it('should support matchers', () => {
    expect('hello').toContain('ell');
    expect([1, 2, 3]).toHaveLength(3);
    expect({ name: 'test' }).toHaveProperty('name');
  });
});
