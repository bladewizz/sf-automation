import { test, expect } from '@playwright/test';

// Load the saved session — every test in this file starts already logged in
test.use({ storageState: 'playwright/.auth/user.json' });

test('lands on Lightning home when authenticated', async ({ page }) => {
  await page.goto('https://orgfarm-47bf10203e-dev-ed.develop.my.salesforce.com/');

  // proof #1: the saved session redirected us into Lightning, not the login page
  await expect(page).toHaveURL(/lightning/, { timeout: 30000 });

  // proof #2: something real is visible on the page
  await expect(page.getByRole('button', { name: 'App Launcher' })).toBeVisible({ timeout: 30000 });
});