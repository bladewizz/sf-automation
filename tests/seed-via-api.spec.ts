import {test, expect} from '@playwright/test';
import {AccountPage} from '../pages/AccountPage';

test.use({ storageState: 'playwright/.auth/user.json' });
test.beforeEach(() => {
    test.skip(!!process.env.CI, 'Requires a user to be logged in. Run the tests locally with a logged-in user.');
});

test('view an APi-created account in the UI', async ({page, request}) => {
    // ARRANGE: Create an account via the API
    const authRes = await
request.post(`${process.env.SF_DOMAIN}/services/oauth2/token`, {
    form: {
      grant_type: 'client_credentials',
      client_id: process.env.SF_CLIENT_ID!,
      client_secret: process.env.SF_CLIENT_SECRET!,
    },
  });
  const auth = await authRes.json();

  const createRes = await request.post(`${auth.instance_url}/services/data/v60.0/sobjects/Account`, {
    headers: { Authorization: `Bearer ${auth.access_token}` },
    data: { Name: 'API Seeded Account' },
  });
  const created = await createRes.json();
  console.log('Created account id:', created.id);

    // ACT — open the API-created record directly in the UI
  const accountPage = new AccountPage(page);
  await accountPage.gotoRecord(created.id);

  // ASSERT — the account is shown in the Lightning UI
  await expect(accountPage.recordHeading('API Seeded Account')).toBeVisible({ timeout: 15000 });
});