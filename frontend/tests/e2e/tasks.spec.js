import { test, expect } from '@playwright/test';

test.describe('Task CRUD', () => {
  test.beforeEach(async ({ page }) => {
    // Requires playwright@test.com / password123 user to exist in DB.
    await page.goto('/login');
    await page.getByTestId('email-input').fill('playwright@test.com');
    await page.getByTestId('password-input').fill('password123');
    await page.getByTestId('login-button').click();
    await expect(page.getByTestId('dashboard-heading')).toBeVisible();
  });

  test('should show tasks or empty state after login', async ({ page }) => {
    const hasEmptyState = await page.getByTestId('empty-state').isVisible().catch(() => false);
    const taskCount = await page.getByTestId('task-item').count();
    expect(hasEmptyState || taskCount > 0).toBeTruthy();
  });

  test('should create a new task', async ({ page }) => {
    await page.getByTestId('task-title-input').fill('Playwright Test Task');
    await page.getByTestId('task-description-input').fill('Created by Playwright');
    await page.getByTestId('add-task-button').click();
    await expect(page.getByTestId('task-title').filter({ hasText: 'Playwright Test Task' })).toBeVisible();
  });

  test('should edit a task', async ({ page }) => {
    await page.getByTestId('task-title-input').fill('Task To Edit');
    await page.getByTestId('task-description-input').fill('Created by Playwright');
    await page.getByTestId('add-task-button').click();

    const firstTask = page.getByTestId('task-item').first();
    await firstTask.getByTestId('edit-task-button').click();
    await firstTask.evaluate((el) => {
      const input = el.querySelector('input');
      if (input) {
        input.value = 'Edited Task Title';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    await firstTask.getByTestId('save-task-button').click();

    await expect(page.getByTestId('task-title').filter({ hasText: 'Edited Task Title' })).toBeVisible();
  });

  test('should delete a task', async ({ page }) => {
    await page.getByTestId('task-title-input').fill('Task To Delete');
    await page.getByTestId('task-description-input').fill('Created by Playwright');
    await page.getByTestId('add-task-button').click();

    const beforeCount = await page.getByTestId('task-item').count();
    const lastTask = page.getByTestId('task-item').last();
    await lastTask.getByTestId('delete-task-button').click();
    await expect(page.getByTestId('task-item')).toHaveCount(beforeCount - 1);
  });

  test('should cancel editing without saving', async ({ page }) => {
    await page.getByTestId('task-title-input').fill('Task To Cancel Edit');
    await page.getByTestId('task-description-input').fill('Created by Playwright');
    await page.getByTestId('add-task-button').click();

    const firstTask = page.getByTestId('task-item').first();
    await firstTask.getByTestId('edit-task-button').click();
    await firstTask.evaluate((el) => {
      const input = el.querySelector('input');
      if (input) {
        input.value = 'Changed Title';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    await firstTask.getByTestId('cancel-edit-button').click();

    await expect(page.getByTestId('task-title').filter({ hasText: 'Task To Cancel Edit' })).toBeVisible();
  });
});
