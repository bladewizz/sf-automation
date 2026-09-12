import { test, expect } from '@playwright/test';

// Load the saved session — every test in this file starts already logged in
test.use({ storageState: 'playwright/.auth/user.json' });

test.beforeEach(() => {
  test.skip(!!process.env.CI, 'Requires a local authenticated session (playwright/.auth/user.json); not available in CI.');
});

test('lands on Lightning home when authenticated', async ({ page }) => {
  await page.goto('/');

  // proof #1: the saved session redirected us into Lightning, not the login page
  await expect(page).toHaveURL(/lightning/, { timeout: 30000 });

  // proof #2: something real is visible on the page
  await expect(page.getByRole('button', { name: 'App Launcher' })).toBeVisible({ timeout: 30000 });
});

test('setup page is reachable without logging in', async ({ page }) => {
  await page.goto('/lightning/setup/SetupOneHome/home');
  await expect(page).toHaveURL(/setup/, { timeout: 30000 });
});

test('accounts list is reachable without logging in', async ({ page }) => {
  await page.goto('/lightning/o/Account/list');
  await expect(page).toHaveURL(/Account/, { timeout: 30000 });
});