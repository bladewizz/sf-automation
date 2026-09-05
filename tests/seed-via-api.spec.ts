import { test, expect } from '@playwright/test';
import { AccountPage } from '../pages/AccountPage';

test.use({ storageState: 'playwright/.auth/user.json' });
test.beforeEach(() => {
  test.skip(!!process.env.CI, 'Requires a local authenticated session (playwright/.auth/user.json); not available in CI.');
});

// [1] shared across the test and the cleanup hook
let accountId: string;
let token: string;
let instanceUrl: string;

test('view an API-created account in the UI', async ({ page, request }) => {
  // ARRANGE — create the account over the API
  const authRes = await request.post(`${process.env.SF_DOMAIN}/services/oauth2/token`, {
    form: {
      grant_type: 'client_credentials',
      client_id: process.env.SF_CLIENT_ID!,
      client_secret: process.env.SF_CLIENT_SECRET!,
    },
  });
  const auth = await authRes.json();
  token = auth.access_token;          // [2] store for the cleanup hook
  instanceUrl = auth.instance_url;    // [2]

  const createRes = await request.post(`${instanceUrl}/services/data/v60.0/sobjects/Account`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { Name: 'API Seeded Account' },
  });
  const created = await createRes.json();
  accountId = created.id;             // [2] store for the cleanup hook

  // ACT — open the record in the UI
  const accountPage = new AccountPage(page);
  await accountPage.gotoRecord(accountId);

  // ASSERT — the account shows in the UI
  await expect(accountPage.recordHeading('API Seeded Account')).toBeVisible({ timeout: 15000 });
});

// [3] CLEANUP — runs after the test, even if it failed
test.afterEach(async ({ request }) => {
  if (accountId) {
    await request.delete(`${instanceUrl}/services/data/v60.0/sobjects/Account/${accountId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
});