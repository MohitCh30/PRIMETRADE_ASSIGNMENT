import { test, expect } from '@playwright/test';

test.describe('Authentication flows', () => {
  test('should show login page by default', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByTestId('login-button')).toBeVisible();
  });

  test('should not crash on empty submit', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('should register a new user', async ({ page }) => {
    await page.goto('/register');
    await page.getByTestId('name-input').fill('Test User');
    await page.getByTestId('email-input').fill(`testuser_${Date.now()}@test.com`);
    await page.getByTestId('password-input').fill('password123');
    await page.getByTestId('register-button').click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByTestId('dashboard-heading')).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    // This test requires playwright@test.com to exist in DB.
    // Register it once manually or let test 3 create it first with that email.
    await page.goto('/login');
    await page.getByTestId('email-input').fill('playwright@test.com');
    await page.getByTestId('password-input').fill('password123');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should redirect unauthenticated user from /dashboard to /login', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
    await context.close();
  });

  test('should logout successfully', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('email-input').fill('playwright@test.com');
    await page.getByTestId('password-input').fill('password123');
    await page.getByTestId('login-button').click();
    await expect(page.getByTestId('dashboard-heading')).toBeVisible();
    await page.getByTestId('logout-button').click();
    await expect(page).toHaveURL(/\/login/);
  });
});
