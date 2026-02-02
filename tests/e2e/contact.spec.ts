import { test, expect } from '@playwright/test';

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('should load contact page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Contact.*Dave Tashner/);
  });

  test('should display contact page header', async ({ page }) => {
    const heroTitle = page.locator('.hero-title');
    await expect(heroTitle).toBeVisible();
    await expect(heroTitle).toContainText('Get in Touch');
  });

  test('should display contact form', async ({ page }) => {
    const form = page.locator('#contact-form');
    await expect(form).toBeVisible();
  });

  test('should have required form fields', async ({ page }) => {
    const nameInput = page.locator('#name');
    const emailInput = page.locator('#email');
    const messageInput = page.locator('#message');
    const verificationInput = page.locator('#verification');
    const submitButton = page.locator('#submit-btn');

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(messageInput).toBeVisible();
    await expect(verificationInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test('should display alternative contact section', async ({ page }) => {
    const alternativeContact = page.locator('.alternative-contact');
    await expect(alternativeContact).toBeVisible();

    const emailLink = page.locator('.email-link');
    await expect(emailLink).toHaveAttribute(
      'href',
      'mailto:hello@davetashner.com'
    );
  });
});

test.describe('Contact Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('should show error when submitting empty form', async ({ page }) => {
    const submitButton = page.locator('#submit-btn');
    await submitButton.click();

    // Check for error messages
    const nameError = page.locator('#name-error');
    await expect(nameError).toContainText('Please enter your name');
  });

  test('should show error for empty name field on blur', async ({ page }) => {
    const nameInput = page.locator('#name');
    await nameInput.focus();
    await nameInput.blur();

    const nameError = page.locator('#name-error');
    await expect(nameError).toContainText('Please enter your name');
  });

  test('should show error for empty email field', async ({ page }) => {
    const emailInput = page.locator('#email');
    await emailInput.focus();
    await emailInput.blur();

    const emailError = page.locator('#email-error');
    await expect(emailError).toContainText('Please enter your email');
  });

  test('should show error for invalid email format', async ({ page }) => {
    const emailInput = page.locator('#email');
    await emailInput.fill('invalid-email');
    await emailInput.blur();

    const emailError = page.locator('#email-error');
    await expect(emailError).toContainText('valid email address');
  });

  test('should clear error when valid email is entered', async ({ page }) => {
    const emailInput = page.locator('#email');

    // First trigger error
    await emailInput.fill('invalid-email');
    await emailInput.blur();
    const emailError = page.locator('#email-error');
    await expect(emailError).toContainText('valid email address');

    // Then fix it
    await emailInput.fill('valid@email.com');
    await expect(emailError).toBeEmpty();
  });

  test('should show error for empty message field', async ({ page }) => {
    const messageInput = page.locator('#message');
    await messageInput.focus();
    await messageInput.blur();

    const messageError = page.locator('#message-error');
    await expect(messageError).toContainText('Please enter your message');
  });

  test('should show error for empty verification field', async ({ page }) => {
    const verificationInput = page.locator('#verification');
    await verificationInput.focus();
    await verificationInput.blur();

    const verificationError = page.locator('#verification-error');
    await expect(verificationError).toContainText('verification question');
  });

  test('should show error for incorrect verification answer', async ({
    page,
  }) => {
    // Fill all required fields
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#message').fill('Test message content');

    // Enter wrong verification answer
    await page.locator('#verification').fill('999');

    // Submit form
    await page.locator('#submit-btn').click();

    const verificationError = page.locator('#verification-error');
    await expect(verificationError).toContainText('Incorrect answer');
  });

  test('should clear field errors on input', async ({ page }) => {
    const nameInput = page.locator('#name');
    const nameError = page.locator('#name-error');

    // Trigger error
    await nameInput.focus();
    await nameInput.blur();
    await expect(nameError).toContainText('Please enter your name');

    // Type to clear error
    await nameInput.fill('John');
    await expect(nameError).toBeEmpty();
  });

  test('should display verification question with numbers', async ({
    page,
  }) => {
    const num1 = page.locator('#num1');
    const num2 = page.locator('#num2');

    await expect(num1).not.toBeEmpty();
    await expect(num2).not.toBeEmpty();
  });

  test('should submit form with valid data and correct verification', async ({
    page,
  }) => {
    // Fill all required fields
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#message').fill('Test message content');

    // Get the verification numbers and calculate answer
    const num1Text = await page.locator('#num1').textContent();
    const num2Text = await page.locator('#num2').textContent();
    const answer = parseInt(num1Text || '0') + parseInt(num2Text || '0');

    await page.locator('#verification').fill(answer.toString());

    // Submit form
    await page.locator('#submit-btn').click();

    // Wait for success message
    const successMessage = page.locator('#success-message');
    await expect(successMessage).toBeVisible({ timeout: 5000 });
    await expect(successMessage).toContainText('Message Sent');
  });
});
