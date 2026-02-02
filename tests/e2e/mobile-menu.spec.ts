import { test, expect } from '@playwright/test';

test.describe('Mobile Menu', () => {
  test.beforeEach(async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
  });

  test('should show hamburger menu button on mobile viewport', async ({
    page,
  }) => {
    const menuToggle = page.locator('#mobile-menu-toggle');
    await expect(menuToggle).toBeVisible();
    await expect(menuToggle).toHaveAttribute(
      'aria-label',
      'Open navigation menu'
    );
    await expect(menuToggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('should hide desktop navigation on mobile viewport', async ({
    page,
  }) => {
    const desktopNav = page.locator('nav[aria-label="Main navigation"]');
    await expect(desktopNav).toBeHidden();
  });

  test('should open mobile menu when hamburger is clicked', async ({
    page,
  }) => {
    const menuToggle = page.locator('#mobile-menu-toggle');
    const mobileMenu = page.locator('#mobile-menu');

    // Menu should initially be hidden
    await expect(mobileMenu).toHaveAttribute('hidden', '');

    // Click hamburger
    await menuToggle.click();

    // Menu should be visible
    await expect(mobileMenu).not.toHaveAttribute('hidden', '');
    await expect(mobileMenu).toHaveAttribute('data-open', 'true');
    await expect(menuToggle).toHaveAttribute('aria-expanded', 'true');
  });

  test('should display navigation links in mobile menu', async ({ page }) => {
    const menuToggle = page.locator('#mobile-menu-toggle');
    await menuToggle.click();

    const mobileNav = page.locator('nav[aria-label="Mobile navigation"]');
    await expect(mobileNav).toBeVisible();

    const homeLink = mobileNav.getByRole('link', { name: 'Home' });
    const aboutLink = mobileNav.getByRole('link', { name: 'About' });
    const blogLink = mobileNav.getByRole('link', { name: 'Blog' });
    const contactLink = mobileNav.getByRole('link', { name: 'Contact' });

    await expect(homeLink).toBeVisible();
    await expect(aboutLink).toBeVisible();
    await expect(blogLink).toBeVisible();
    await expect(contactLink).toBeVisible();
  });

  test('should close mobile menu when close button is clicked', async ({
    page,
  }) => {
    const menuToggle = page.locator('#mobile-menu-toggle');
    const closeButton = page.locator('#mobile-menu-close');
    const mobileMenu = page.locator('#mobile-menu');

    // Open menu
    await menuToggle.click();
    await expect(mobileMenu).toHaveAttribute('data-open', 'true');

    // Close menu
    await closeButton.click();

    // Menu should be closing/closed
    await expect(mobileMenu).toHaveAttribute('data-open', 'false');
    await expect(menuToggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('should close mobile menu when backdrop is clicked', async ({
    page,
  }) => {
    const menuToggle = page.locator('#mobile-menu-toggle');
    const backdrop = page.locator('.mobile-menu__backdrop');
    const mobileMenu = page.locator('#mobile-menu');

    // Open menu
    await menuToggle.click();
    await expect(mobileMenu).toHaveAttribute('data-open', 'true');

    // Click backdrop
    await backdrop.click({ position: { x: 10, y: 200 } });

    // Menu should be closing/closed
    await expect(mobileMenu).toHaveAttribute('data-open', 'false');
  });

  test('should close mobile menu when Escape key is pressed', async ({
    page,
  }) => {
    const menuToggle = page.locator('#mobile-menu-toggle');
    const mobileMenu = page.locator('#mobile-menu');

    // Open menu
    await menuToggle.click();
    await expect(mobileMenu).toHaveAttribute('data-open', 'true');

    // Press Escape
    await page.keyboard.press('Escape');

    // Menu should be closing/closed
    await expect(mobileMenu).toHaveAttribute('data-open', 'false');
  });

  test('should navigate to page when mobile nav link is clicked', async ({
    page,
  }) => {
    const menuToggle = page.locator('#mobile-menu-toggle');
    await menuToggle.click();

    const aboutLink = page
      .locator('nav[aria-label="Mobile navigation"]')
      .getByRole('link', { name: 'About' });
    await aboutLink.click();

    await expect(page).toHaveURL(/\/about/);
  });

  test('should close mobile menu when navigation link is clicked', async ({
    page,
  }) => {
    const menuToggle = page.locator('#mobile-menu-toggle');
    const mobileMenu = page.locator('#mobile-menu');

    await menuToggle.click();
    await expect(mobileMenu).toHaveAttribute('data-open', 'true');

    const blogLink = page
      .locator('nav[aria-label="Mobile navigation"]')
      .getByRole('link', { name: 'Blog' });
    await blogLink.click();

    // Menu should close on navigation
    await expect(mobileMenu).toHaveAttribute('data-open', 'false');
  });

  test('should focus close button when menu opens', async ({ page }) => {
    const menuToggle = page.locator('#mobile-menu-toggle');
    const closeButton = page.locator('#mobile-menu-close');

    await menuToggle.click();

    // Close button should be focused for accessibility
    await expect(closeButton).toBeFocused();
  });

  test('should highlight active link in mobile menu', async ({ page }) => {
    const menuToggle = page.locator('#mobile-menu-toggle');
    await menuToggle.click();

    const homeLink = page
      .locator('nav[aria-label="Mobile navigation"]')
      .getByRole('link', { name: 'Home' });

    await expect(homeLink).toHaveClass(/mobile-nav-link--active/);
    await expect(homeLink).toHaveAttribute('aria-current', 'page');
  });

  test('should prevent body scroll when menu is open', async ({ page }) => {
    const menuToggle = page.locator('#mobile-menu-toggle');

    // Open menu
    await menuToggle.click();

    // Body should have overflow hidden
    const bodyOverflow = await page.evaluate(
      () => document.body.style.overflow
    );
    expect(bodyOverflow).toBe('hidden');

    // Close menu
    const closeButton = page.locator('#mobile-menu-close');
    await closeButton.click();

    // Wait for menu to close
    await page.waitForTimeout(350);

    // Body scroll should be restored
    const bodyOverflowAfter = await page.evaluate(
      () => document.body.style.overflow
    );
    expect(bodyOverflowAfter).toBe('');
  });
});

test.describe('Mobile Menu - Tablet viewport', () => {
  test.beforeEach(async ({ page }) => {
    // Set tablet viewport (still shows mobile menu at 768px-1px)
    await page.setViewportSize({ width: 767, height: 1024 });
    await page.goto('/');
  });

  test('should show mobile menu on tablet-sized viewport', async ({ page }) => {
    const menuToggle = page.locator('#mobile-menu-toggle');
    await expect(menuToggle).toBeVisible();
  });
});

test.describe('Desktop Navigation - Large viewport', () => {
  test.beforeEach(async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');
  });

  test('should hide mobile menu button on desktop viewport', async ({
    page,
  }) => {
    const menuToggle = page.locator('#mobile-menu-toggle');
    await expect(menuToggle).toBeHidden();
  });

  test('should show desktop navigation on large viewport', async ({ page }) => {
    const desktopNav = page.locator('nav[aria-label="Main navigation"]');
    await expect(desktopNav).toBeVisible();
  });
});
