import { test, expect } from '@playwright/test';

test.describe.serial('Account CRUD lifecycle', () => {
  let token: string;
  let instanceUrl: string;
  let accountId: string;

  test.beforeAll(async ({ playwright }) => {
    const request = await playwright.request.newContext();
    const res = await request.post(`${process.env.SF_DOMAIN}/services/oauth2/token`, {
      form: {
        grant_type: 'client_credentials',
        client_id: process.env.SF_CLIENT_ID!,
        client_secret: process.env.SF_CLIENT_SECRET!,
      },
    });
    const body = await res.json();
    token = body.access_token;
    instanceUrl = body.instance_url;
  });

  test('CREATE an account', async ({ request }) => {
    const res = await request.post(`${instanceUrl}/services/data/v60.0/sobjects/Account`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { Name: 'CRUD Test Corp' },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    accountId = body.id;
    console.log('Created account:', accountId);
  });

  test('READ the account', async ({ request }) => {
    const res = await request.get(`${instanceUrl}/services/data/v60.0/sobjects/Account/${accountId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.Id).toBe(accountId);
    expect(body.Name).toBe('CRUD Test Corp');
  });

  test('UPDATE the account', async ({ request }) => {
    const res = await request.patch(`${instanceUrl}/services/data/v60.0/sobjects/Account/${accountId}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { Name: 'CRUD Test Corp Updated' },
    });
    // Optionally, you can read back the account to verify the update
    const verifyRes = await request.get(`${instanceUrl}/services/data/v60.0/sobjects/Account/${accountId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const verifyBody = await verifyRes.json();
    expect(verifyBody.Name).toBe('CRUD Test Corp Updated');
    expect(res.status()).toBe(204);
  });

  test('DELETE the account', async ({ request }) => {
    const res = await request.delete(`${instanceUrl}/services/data/v60.0/sobjects/Account/${accountId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const verifyRes = await request.get(`${instanceUrl}/services/data/v60.0/sobjects/Account/${accountId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(verifyRes.status()).toBe(404);
    expect(res.status()).toBe(204);
  });
});

