import { Page, FrameLocator } from "@playwright/test";

export class MSTeamsPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getMoreAppsButton() {
    return this.page.getByRole('button', { name: /view more apps/i });
  }

  getSearchBox() {
    return this.page.getByPlaceholder(/search for apps/i);
  }

  getAppItem() {
    return this.page.getByRole('button', {
      name: /salesforce it service/i
    }).first();
  }

  getIframe() {
    return this.page.locator('iframe[name="embedded-page-container"]');
  }

  getFrame(): FrameLocator {
    return this.page.frameLocator('iframe[name="embedded-page-container"]');
  }

  getLoginButton(frame: FrameLocator) {
    return frame.getByRole('button', {
      name: /login to salesforce|login|sign in/i
    });
  }

  getPortalInput(frame: FrameLocator) {
    return frame.getByPlaceholder('Enter a Portal URL');
  }

  getNextButton(frame: FrameLocator) {
    return frame.getByRole('button', { name: /next/i });
  }

  getUsername(popup: Page) {
    return popup.getByPlaceholder(/username|email/i);
  }

  getPassword(popup: Page) {
    return popup.getByPlaceholder(/password/i);
  }

  getLoginBtn(popup: Page) {
    return popup.getByRole('button', { name: /log in|sign in/i });
  }

  getMyticketsTab(frame: FrameLocator) {
    return frame.getByRole('tab', { name: /my tickets/i });
  }
  getTicketData(frame: FrameLocator) {
    return frame.locator('table, [data-testid="ticket"], text=/ticket/i').first();
  }
  getLogoutButton(frame: FrameLocator) {
    return frame.getByRole('button', { name: /logout/i });
  }

  getLoginAgain(page: Page) {
    return page.getByRole('button', { name: /login|sign in/i });
  }
}