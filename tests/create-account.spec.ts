import { test, expect } from '@playwright/test';
import { AccountPage } from '../pages/AccountPage';

test.use({ storageState: 'playwright/.auth/user.json' });
test.beforeEach(() => {
  test.skip(!!process.env.CI, 'Requires a local authenticated session (playwright/.auth/user.json); not available in CI.');
});

test('create an account via the UI', async ({ page }) => {
  const accountPage = new AccountPage(page);
  await accountPage.gotoList();
  await accountPage.createAccount('Oracle');
  await expect(accountPage.recordHeading('Oracle')).toBeVisible({ timeout: 15000 });
});