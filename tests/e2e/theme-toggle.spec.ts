import { test, expect } from '@playwright/test';

test.describe('Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to start fresh
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should display theme toggle button', async ({ page }) => {
    const themeToggle = page.locator('#theme-toggle');
    await expect(themeToggle).toBeVisible();
    await expect(themeToggle).toHaveAttribute('aria-label', /mode/i);
  });

  test('should toggle from light to dark mode', async ({ page }) => {
    const html = page.locator('html');
    const themeToggle = page.locator('#theme-toggle');

    // Initially should be in light mode (no dark class)
    const initialDarkMode = await html.evaluate((el) =>
      el.classList.contains('dark')
    );

    // Click to toggle
    await themeToggle.click();

    // Should be in opposite mode
    const afterToggleDarkMode = await html.evaluate((el) =>
      el.classList.contains('dark')
    );
    expect(afterToggleDarkMode).not.toBe(initialDarkMode);
  });

  test('should toggle from dark to light mode', async ({ page }) => {
    const html = page.locator('html');
    const themeToggle = page.locator('#theme-toggle');

    // Set to dark mode first
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    });

    // Verify dark mode is set
    await expect(html).toHaveClass(/dark/);

    // Click to toggle
    await themeToggle.click();

    // Should be in light mode
    await expect(html).not.toHaveClass(/dark/);
  });

  test('should persist theme preference in localStorage', async ({ page }) => {
    const themeToggle = page.locator('#theme-toggle');

    // Toggle to dark mode
    await themeToggle.click();

    // Check localStorage
    const storedTheme = await page.evaluate(() =>
      localStorage.getItem('theme')
    );
    expect(storedTheme).toBe('dark');

    // Toggle back to light mode
    await themeToggle.click();

    const storedTheme2 = await page.evaluate(() =>
      localStorage.getItem('theme')
    );
    expect(storedTheme2).toBe('light');
  });

  test('should persist theme across page navigation', async ({ page }) => {
    const themeToggle = page.locator('#theme-toggle');
    const html = page.locator('html');

    // Toggle to dark mode
    await themeToggle.click();
    await expect(html).toHaveClass(/dark/);

    // Navigate to another page
    await page.goto('/contact');

    // Should still be in dark mode
    await expect(html).toHaveClass(/dark/);
  });

  test('should update aria-label based on current mode', async ({ page }) => {
    const themeToggle = page.locator('#theme-toggle');

    // Get initial aria-label
    const initialLabel = await themeToggle.getAttribute('aria-label');

    // Toggle theme
    await themeToggle.click();

    // Aria-label should change
    const newLabel = await themeToggle.getAttribute('aria-label');
    expect(newLabel).not.toBe(initialLabel);
  });

  test('should show correct icon based on theme', async ({ page }) => {
    const sunIcon = page.locator('#theme-toggle .sun-icon');
    const moonIcon = page.locator('#theme-toggle .moon-icon');
    const themeToggle = page.locator('#theme-toggle');
    const html = page.locator('html');

    // In light mode, moon icon should be visible (scale-100)
    // In dark mode, sun icon should be visible (scale-100)

    // Check we start in a known state
    const isDark = await html.evaluate((el) => el.classList.contains('dark'));

    if (!isDark) {
      // Light mode: moon icon visible (scale-100), sun icon hidden (scale-0)
      await expect(moonIcon).toHaveClass(/scale-100/);
      await expect(sunIcon).toHaveClass(/scale-0/);
    } else {
      // Dark mode: sun icon visible (dark:scale-100), moon icon hidden (dark:scale-0)
      await expect(sunIcon).toHaveClass(/dark:scale-100/);
      await expect(moonIcon).toHaveClass(/dark:scale-0/);
    }

    // Toggle and verify icons swap
    await themeToggle.click();

    const isNowDark = await html.evaluate((el) =>
      el.classList.contains('dark')
    );
    if (isNowDark) {
      // Now in dark mode
      await expect(sunIcon).toBeVisible();
    } else {
      // Now in light mode
      await expect(moonIcon).toBeVisible();
    }
  });
});
