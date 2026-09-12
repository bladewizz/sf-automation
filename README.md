# SF Automation

SF Automation is a test automation suite for Salesforce using Playwright and Typescript. The scope of this project involves API and UI testing against an existing Salesforce organization. The goal of this project was to demonstrate the ability to create and manipulate: page objects, CI, and API-setup.

## Tech Stack

- Playwright — test runner and browser automation
- TypeScript
- Salesforce REST API
- GitHub Actions — CI

## Architecture

The suite tests Salesforce at two levels, split into separate Playwright projects:

**API tests** (`tests/api/`) — hits Salesforce's REST API directly, with no browser. Authenticates with OAuth 2.0 client-credentials (using a token retrieved at set up and then passed as a Bearer header) and covers the full CRUD lifecycle along with SOQL queries. Runs in CI.

**UI tests** (`tests/`) — drive the Salesforce Lightning interface in a real browser. Salesforce enforces MFA, so the login can't be scripted. Instead, a signed-in session is captured once through a manual login and saved as `storageState`, which every UI test reuses to start already authenticated. (These tests skip in CI, since they need that local session.)

**Page Object Model** (`pages/`) — UI selectors and actions live in page classes, not in the tests. A test reads as `accountPage.createAccount('Oracle')` and contains no raw selectors. Maintainable as only one item needs to be changed instead of multiple.

**Setup via API, assert in the UI** — the suite's core strategy. Instead of building test data by clicking through the UI, records are created on the back end via the API, and the UI is used only to verify the behavior. This keeps the fragile UI out of test *setup* and exercises only where the UI is the actual thing being tested.

## Getting Started

### Prerequisites
- Node.js (LTS)
- Your own Salesforce Developer Edition org (free), with an External Client App configured for the OAuth 2.0 **client-credentials** flow — this provides the consumer key and secret below.

### Install
```bash
git clone https://github.com/bladewizz/sf-automation.git
cd sf-automation
npm ci
npx playwright install
```

### Configure
Create a `.env` file in the project root with your org's API credentials:

```
SF_DOMAIN=https://<your-domain>.my.salesforce.com
SF_CLIENT_ID=<your_consumer_key>
SF_CLIENT_SECRET=<your_consumer_secret>
```

These power the API tests and the UI `baseURL`. `.env` is git-ignored. Please do not commit the .env file.

### Capture a session for the UI tests
The UI tests reuse a saved login to get past Salesforce MFA. Capture one once:

```bash
npx playwright codegen "https://<your-domain>.my.salesforce.com" --save-storage="playwright/.auth/user.json"
```

Log in by hand (including any verification prompt), land on the Lightning home page, then close the window. Your session is saved to `playwright/.auth/user.json` (git-ignored). Sessions expire — re-run this command when UI tests start failing with a login redirect.

### Run the tests
```bash
npx playwright test                     # full suite
npx playwright test --project=api       # API tests only (no browser or session needed)
npx playwright test --project=chromium  # UI tests in Chromium
```

## What's Covered

**API** (`tests/api/`)
- `crud.spec.ts` — full create/read/update/delete lifecycle of an Account, asserting on both status codes and response bodies, with verify-by-read on update and delete.
- `soql.spec.ts` — SOQL over the REST API: a filtered query (asserting row count) and a relationship traversal.
- `salesforce.spec.ts` — authentication and reading a record over the API.

**UI** (`tests/`)
- `lightning.spec.ts` — authenticated navigation into Lightning (home, Setup, Accounts) using the saved session.
- `create-account.spec.ts` — creating an Account end-to-end through the Lightning UI, via the page object.
- `seed-via-api.spec.ts` — the setup-via-API / assert-in-UI pattern: an Account is created over the API, verified on its Lightning record page, then deleted in teardown.

## Continuous Integration

CI runs on GitHub Actions (`.github/workflows/playwright.yml`) on every push, pull request, and a nightly schedule.

- **API tests run in CI**, authenticating with credentials stored as GitHub repository secrets.
- **UI tests are skipped in CI** — they require the local `storageState` session, which never lives in the repo.
- **Artifacts:** the HTML report and Playwright traces are uploaded on every run. A failed run leaves a downloadable `trace.zip`, openable with `npx playwright show-trace`.
- A local retry absorbs transient flake from the shared org under load.
