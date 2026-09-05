import { Page, Locator } from '@playwright/test';


export class AccountPage {
  readonly page: Page;
  readonly newButton: Locator;
  readonly nameInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newButton = page.getByRole('button', { name: 'New' });
    this.nameInput = page.getByRole('dialog').getByLabel('Account Name');
    this.saveButton = page.getByRole('button', { name: 'Save', exact: true });
  }

  async gotoList() {
    await this.page.goto('/lightning/o/Account/list');
  }

  async gotoRecord(id: string) {
    await this.page.goto(`/lightning/r/Account/${id}/view`);
  }

  async createAccount(name: string) {
    await this.newButton.click();
    await this.nameInput.fill(name);
    await this.saveButton.click();
  }

  recordHeading(name: string): Locator {
    return this.page.getByRole('heading', { name });
  }
}