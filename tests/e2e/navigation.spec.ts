import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display site logo that links to home', async ({ page }) => {
    const logo = page.locator('.site-logo');
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute('href', '/');
    await expect(logo).toContainText('Dave Tashner');
  });

  test('should have desktop navigation links', async ({ page }) => {
    // Desktop navigation is visible on larger screens
    await page.setViewportSize({ width: 1024, height: 768 });

    const nav = page.locator('nav[aria-label="Main navigation"]');
    await expect(nav).toBeVisible();

    const homeLink = nav.getByRole('link', { name: 'Home' });
    const aboutLink = nav.getByRole('link', { name: 'About' });
    const blogLink = nav.getByRole('link', { name: 'Blog' });
    const contactLink = nav.getByRole('link', { name: 'Contact' });

    await expect(homeLink).toBeVisible();
    await expect(aboutLink).toBeVisible();
    await expect(blogLink).toBeVisible();
    await expect(contactLink).toBeVisible();
  });

  test('should navigate to About page', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });

    const aboutLink = page
      .locator('nav[aria-label="Main navigation"]')
      .getByRole('link', { name: 'About' });
    await aboutLink.click();
    await expect(page).toHaveURL(/\/about/);
  });

  test('should navigate to Blog page', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });

    const blogLink = page
      .locator('nav[aria-label="Main navigation"]')
      .getByRole('link', { name: 'Blog' });
    await blogLink.click();
    await expect(page).toHaveURL(/\/blog/);
  });

  test('should navigate to Contact page', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });

    const contactLink = page
      .locator('nav[aria-label="Main navigation"]')
      .getByRole('link', { name: 'Contact' });
    await contactLink.click();
    await expect(page).toHaveURL(/\/contact/);
  });

  test('should highlight active nav link on current page', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });

    const homeLink = page
      .locator('nav[aria-label="Main navigation"]')
      .getByRole('link', { name: 'Home' });
    await expect(homeLink).toHaveClass(/nav-link--active/);
    await expect(homeLink).toHaveAttribute('aria-current', 'page');
  });

  test('should add scrolled class to header on scroll', async ({ page }) => {
    const header = page.locator('#site-header');
    await expect(header).not.toHaveClass(/header--scrolled/);

    await page.evaluate(() => window.scrollBy(0, 100));
    await expect(header).toHaveClass(/header--scrolled/);
  });
});
