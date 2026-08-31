
import { test, expect } from '@playwright/test';
test.describe.serial('soql query', () => {
  let token: string;
  let instanceUrl: string;

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


  test('filtered query returns acme corp', async ({request}) => {
    const query = 'SELECT Name FROM Account WHERE NAME = \'Acme Corp\'';
   const accountResponse = await request.get(`${instanceUrl}/services/data/v60.0/query`, {
    params: { q: query },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  expect(accountResponse.status()).toBe(200);
  const data = await accountResponse.json();
  expect(data.totalSize).toBe(1);
  expect(data.records[0].Name).toBe('Acme Corp');
  }); 

  test('relationship query reaches the creator', async ({request}) => {
    const query = 'SELECT Name, CreatedBy.Name FROM Account WHERE NAME = \'Acme Corp\'';
    const accountResponse = await request.get(`${instanceUrl}/services/data/v60.0/query`, {
      params: { q: query },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    expect(accountResponse.status()).toBe(200);
    const data = await accountResponse.json();
    expect(data.totalSize).toBe(1);
    expect(data.records[0].CreatedBy.Name).toBeDefined();
  });
});