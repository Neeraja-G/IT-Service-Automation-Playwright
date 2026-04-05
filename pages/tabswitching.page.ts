import { Page, FrameLocator, Locator } from '@playwright/test';

export class MSTeamsPage {
  constructor(private page: Page) {}

  // 🔥 More reliable frame selection
  getFrame(): FrameLocator {
    // Use specific iframe if possible (update src/title after inspecting)
    return this.page.frameLocator('iframe').first();
  }

  // Tabs (safe locators)
  getMyTicketsTab(frame: FrameLocator): Locator {
    return frame.getByRole('tab', { name: 'My Tickets' }).first();
  }

  getServiceCatalogTab(frame: FrameLocator): Locator {
    return frame.getByRole('tab', { name: 'Service Catalog' }).first();
  }

  getApprovalsTab(frame: FrameLocator): Locator {
    return frame.getByRole('tab', { name: 'Approvals' }).first();
  }

   getAskAIAgentTab(frame: FrameLocator): Locator {
    return frame.getByRole('tab', { name: 'Ask AI Agent' }).first();
  }

  getEmployeeEnablementTab(frame: FrameLocator): Locator {
    return frame.getByRole('tab', { name: 'Employee Enablement' }).first();
  }
}