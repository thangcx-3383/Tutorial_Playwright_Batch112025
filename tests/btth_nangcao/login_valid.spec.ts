import test, { expect } from "@playwright/test";

const BASE_URL = "https://www.saucedemo.com/";

const USERNAME_INPUT = 'input[id="user-name"][name="user-name"]';
const PASSWORD_INPUT = 'input[id="password"][name="password"]';
const LOGIN_BUTTON = 'input[id="login-button"]';

test.beforeEach(async ({ page }) => {
  await page.goto(BASE_URL);
  const usernameInput = page.locator(USERNAME_INPUT);
  const passwordInput = page.locator(PASSWORD_INPUT);
  const loginButton = page.locator(LOGIN_BUTTON);

  expect(await usernameInput.isVisible());
  expect(await passwordInput.isVisible());
  expect(await loginButton.isVisible());
});

test("login success", async ({ page }) => {
  const usernameInput = page.locator(USERNAME_INPUT);
  const passwordInput = page.locator(PASSWORD_INPUT);
  const loginButton = page.locator(LOGIN_BUTTON);

  await usernameInput.fill("standard_user");
  await passwordInput.fill("secret_sauce");
  await loginButton.click();

  const productsTitle = page.locator("span.title");
  await productsTitle.waitFor({ state: "visible" });

  await expect(productsTitle).toBeVisible();
  await expect(productsTitle).toHaveText("Products");
});
