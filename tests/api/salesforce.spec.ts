import { test, expect } from '@playwright/test';

test('authenticate with Salesforce', async ({ request }) => {
  const response = await request.post(`${process.env.SF_DOMAIN}/services/oauth2/token`, {
    form: {
      grant_type: 'client_credentials',
      client_id: process.env.SF_CLIENT_ID!,
      client_secret: process.env.SF_CLIENT_SECRET!,
    },
  });

  expect(response.status()).toBe(200);
  const body = await response.json();
  console.log('Got a token:', body.access_token ? 'yes' : 'no');
  const token = body.access_token;
  const instanceUrl = body.instance_url;

  const query = "SELECT Name, Industry FROM Account WHERE Name = 'Acme Corp'";
  const accountResponse = await request.get(`${instanceUrl}/services/data/v60.0/query`, {
    params: { q: query },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  expect(accountResponse.status()).toBe(200);
  const data = await accountResponse.json();
  console.log('Records found:', data.totalSize);
  console.log('First account name:', data.records[0].Name);
  expect(data.records[0].Name).toBe('Acme Corp');
});