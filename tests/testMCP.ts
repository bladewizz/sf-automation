import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await page.getByRole('link', { name: 'Node.js' }).click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Model Context Protocol' }).click();
  const page1 = await page1Promise;
  await page1.locator('a').filter({ hasText: 'Understand conceptsLearn the' }).click();
});