import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/user.json' });

test.beforeEach(() => {
  test.skip(!!process.env.CI, 'Requires a local authenticated session (playwright/.auth/user.json); not available in CI.');
});

test('create an account via the UI', async ({ page }) => {
  // Step 1: go to the Accounts list page
  await page.goto('https://orgfarm-47bf10203e-dev-ed.develop.my.salesforce.com/lightning/o/Account/list');

  // Step 2: click the New button  ← you write this line, using a ROLE locator (4.3)
  await page.getByRole('button', { name: 'New' }).click();

  // Step 3: fill in the Account Name field
  await page.getByRole('dialog').getByLabel('Account Name').fill('Oracle');

  // Step 4: click the Save button
  await page.getByRole('button', { name: 'Save', exact: true }).click();

  // Step 5: verify that the new account appears in the list
  await expect(page.getByRole('heading', { name: 'Oracle' })).toBeVisible({ timeout: 15000 });
});