import { test, expect } from '@playwright/test';

test.describe('Blog Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
  });

  test('should load blog page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Blog.*Dave Tashner/);
  });

  test('should display blog page header', async ({ page }) => {
    const pageTitle = page.locator('.page-title');
    await expect(pageTitle).toBeVisible();
    await expect(pageTitle).toContainText('Blog');
  });

  test('should display page description', async ({ page }) => {
    const pageDescription = page.locator('.page-description');
    await expect(pageDescription).toBeVisible();
    await expect(pageDescription).toContainText('software development');
  });

  test('should display blog posts grid or empty state', async ({ page }) => {
    // Check for either blog grid with posts or empty state
    const blogGrid = page.locator('.blog-grid');
    const emptyState = page.locator('.empty-state');

    const hasPosts = await blogGrid.count();
    const isEmpty = await emptyState.count();

    // Either blog grid or empty state should be visible
    expect(hasPosts > 0 || isEmpty > 0).toBeTruthy();
  });

  test('should display tag cloud if posts have tags', async ({ page }) => {
    const tagCloud = page.locator('.tag-cloud');
    // Tag cloud may or may not be present depending on content
    const hasTagCloud = (await tagCloud.count()) > 0;

    if (hasTagCloud) {
      await expect(tagCloud).toBeVisible();
      await expect(tagCloud.locator('.tag-cloud-label')).toContainText(
        'Browse by topic'
      );
    }
  });
});

test.describe('Blog Post Navigation', () => {
  test('should navigate to blog post when clicking on blog card', async ({
    page,
  }) => {
    await page.goto('/blog');

    // Find any blog card link (if posts exist)
    const blogCardLink = page.locator('article a[href^="/blog/"]').first();
    const hasPosts = (await blogCardLink.count()) > 0;

    if (hasPosts) {
      await blogCardLink.click();
      await expect(page).toHaveURL(/\/blog\/.+/);
    }
  });

  test('should navigate to tag page when clicking on tag', async ({ page }) => {
    await page.goto('/blog');

    const tagLink = page.locator('.tag-cloud-item').first();
    const hasTags = (await tagLink.count()) > 0;

    if (hasTags) {
      await tagLink.click();
      await expect(page).toHaveURL(/\/blog\/tag\/.+/);
    }
  });
});

test.describe('Blog Post Page', () => {
  test('should display blog post content', async ({ page }) => {
    await page.goto('/blog');

    // Navigate to first blog post if it exists
    const blogCardLink = page.locator('article a[href^="/blog/"]').first();
    const hasPosts = (await blogCardLink.count()) > 0;

    if (hasPosts) {
      await blogCardLink.click();
      await expect(page).toHaveURL(/\/blog\/.+/);

      // Verify post content elements exist
      const postTitle = page.locator('h1');
      await expect(postTitle).toBeVisible();

      const article = page.locator('article');
      await expect(article).toBeVisible();
    }
  });
});
