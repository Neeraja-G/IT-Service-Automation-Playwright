import { expect, test } from "@playwright/test";
import { MSTeamsWeb } from "../../core/src";
import { URLS } from "../../utils/url.util";
import { TEST_DATA } from "../../utils/testdata.util";
import { MSTeamsPage } from "../../pages/msteams--web.page";

test.describe("Teams Web Tests", () => {

  let teams: MSTeamsWeb;
  let teamsPage: MSTeamsPage;

  test.beforeAll(async () => {
    test.setTimeout(180000);
    teams = new MSTeamsWeb({});
    await teams.launch();
  });

  test.afterAll(async () => {
    await teams.close();
  });

  test("should open View more apps and login to Salesforce IT Service", async () => {
    const page = teams.getPage();
    teamsPage = new MSTeamsPage(page);

    const moreAppsBtn = teamsPage.getMoreAppsButton();
    await expect(moreAppsBtn).toBeVisible({ timeout: 60000 });
    await page.keyboard.press('Escape');
    await moreAppsBtn.click();

    const searchBox = teamsPage.getSearchBox();
    await expect(searchBox).toBeVisible({ timeout: 60000 });
    await searchBox.fill("Salesforce IT Service");

    const appItem = teamsPage.getAppItem();
    await expect(appItem).toBeVisible({ timeout: 60000 });
    await appItem.click();

    const iframeLocator = teamsPage.getIframe();
    await expect(iframeLocator).toBeVisible({ timeout: 60000 });

    let frame = teamsPage.getFrame();
    const loginButton = teamsPage.getLoginButton(frame);
    if (!(await loginButton.isDisabled())) {
      await loginButton.click();
    }

    frame = teamsPage.getFrame();
    const portalInput = teamsPage.getPortalInput(frame);
    let popup;

    if (await portalInput.isVisible().catch(() => false)) {
      await portalInput.fill(URLS.LoginURL);
      const nextBtn = teamsPage.getNextButton(frame);
      [popup] = await Promise.all([
        page.waitForEvent('popup'),
        nextBtn.click()
      ]);

    } else {
      popup = await page.waitForEvent('popup', { timeout: 60000 });
    }

    await popup.waitForLoadState();
    await teamsPage.getUsername(popup).fill(TEST_DATA.UserName);
    await teamsPage.getPassword(popup).fill(TEST_DATA.Password);
    await teamsPage.getLoginBtn(popup).click();
    await Promise.race([
      popup.waitForEvent('close').catch(() => { }),
      popup.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => { })
    ]);

    const iframeLocatorAfterLogin = teamsPage.getIframe();
    await expect(iframeLocatorAfterLogin).toBeVisible({ timeout: 60000 });
    // Re-create frame (NEW DOM)
    const frameAfterLogin = teamsPage.getFrame();
    // Now find My Tickets
    const myTicketsTab = teamsPage.getMyticketsTab(frameAfterLogin);
    const ticketData = teamsPage.getTicketData(frameAfterLogin);
    //  Always re-fetch frame before action
    const frameNow = teamsPage.getFrame();

    // Logout
    let logoutBtn = teamsPage.getLogoutButton(frameNow);

    if (!(await logoutBtn.isVisible().catch(() => false))) {
      const logoutBtn = page.getByRole('button', { name: /logout/i });
    }
    //  Click logout safely
    await Promise.all([
      page.waitForLoadState('domcontentloaded').catch(() => { }),
      logoutBtn.click()
    ]);
    //  Wait for app to reload
    await page.waitForTimeout(5000);
 // Check iframe if not in main page
   let loginAgain = teamsPage.getLoginAgain(page);

if (!(await loginAgain.isVisible().catch(() => false))) {
  for (const f of page.frames()) {
    const btn = f.getByRole('button', { name: /login|sign in/i });
    if (await btn.isVisible().catch(() => false)) {
      loginAgain = btn;
      break;
    }
  }
}
// Final assertion
await expect(loginAgain).toBeVisible({ timeout: 60000 });
  });
});