import { test as base, Page } from "@playwright/test";
export { expect } from "@playwright/test";

interface SaucedemoFixtures {
  loggedInPage: Page;
}

// Use storage state for authentication
base.use({ storageState: "playwright/.auth/user.json" });

export const test = base.extend<SaucedemoFixtures>({
  loggedInPage: async ({ page }, use) => {
    await page.goto("https://www.saucedemo.com/inventory.html");

    await page.waitForLoadState("networkidle");

    await use(page);
  },
});
