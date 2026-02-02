import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load successfully with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Dave Tashner/);
  });

  test('should display hero section with name', async ({ page }) => {
    const heroTitle = page.locator('.hero-title');
    await expect(heroTitle).toBeVisible();
    await expect(heroTitle).toContainText('Dave Tashner');
  });

  test('should display hero tagline', async ({ page }) => {
    const tagline = page.locator('.hero-tagline');
    await expect(tagline).toBeVisible();
    await expect(tagline).toContainText('Software engineer');
  });

  test('should have View Blog CTA button that navigates to blog', async ({
    page,
  }) => {
    const viewBlogBtn = page.locator('.hero-cta').getByRole('link', {
      name: /View Blog/i,
    });
    await expect(viewBlogBtn).toBeVisible();
    await viewBlogBtn.click();
    await expect(page).toHaveURL(/\/blog/);
  });

  test('should have Contact Me CTA button that navigates to contact', async ({
    page,
  }) => {
    const contactBtn = page.locator('.hero-cta').getByRole('link', {
      name: /Contact Me/i,
    });
    await expect(contactBtn).toBeVisible();
    await contactBtn.click();
    await expect(page).toHaveURL(/\/contact/);
  });

  test('should display About Me section', async ({ page }) => {
    const aboutSection = page.locator('#intro');
    await expect(aboutSection).toBeVisible();
    await expect(aboutSection.locator('.section-title')).toContainText(
      'About Me'
    );
  });

  test('should display Recent Posts section', async ({ page }) => {
    const blogSection = page.locator('.blog-section');
    await expect(blogSection).toBeVisible();
    await expect(blogSection.locator('.section-title')).toContainText(
      'Recent Posts'
    );
  });

  test('should display blog cards', async ({ page }) => {
    const blogCards = page.locator('.blog-card');
    await expect(blogCards.first()).toBeVisible();
  });

  test('should display Contact CTA section', async ({ page }) => {
    const contactCTA = page.locator('.contact-cta-section');
    await expect(contactCTA).toBeVisible();
    await expect(contactCTA.locator('.contact-cta-title')).toContainText(
      "Let's Connect"
    );
  });

  test('should have footer visible', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });
});
