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

test("login with empty username", async ({ page }) => {
  const usernameInput = page.locator(USERNAME_INPUT);
  const passwordInput = page.locator(PASSWORD_INPUT);
  const loginButton = page.locator(LOGIN_BUTTON);

  await loginButton.click();

  const errorMessage = page.locator('h3[data-test="error"]');
  await errorMessage.waitFor({ state: "visible" });

  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toHaveText("Epic sadface: Username is required");
  await expect(usernameInput).toHaveClass(/error/);
  await expect(passwordInput).toHaveClass(/error/);
});

test("login with empty password", async ({ page }) => {
  const usernameInput = page.locator(USERNAME_INPUT);
  const passwordInput = page.locator(PASSWORD_INPUT);
  const loginButton = page.locator(LOGIN_BUTTON);

  await usernameInput.fill("standard_user");
  await loginButton.click();

  const errorMessage = page.locator('h3[data-test="error"]');
  await errorMessage.waitFor({ state: "visible" });

  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toHaveText("Epic sadface: Password is required");
  await expect(usernameInput).toHaveClass(/error/);
  await expect(passwordInput).toHaveClass(/error/);
});

test("login with valid password", async ({ page }) => {
  const usernameInput = page.locator(USERNAME_INPUT);
  const passwordInput = page.locator(PASSWORD_INPUT);
  const loginButton = page.locator(LOGIN_BUTTON);

  await usernameInput.fill("standard_user");
  await passwordInput.fill("password_invalid");
  await loginButton.click();

  const errorMessage = page.locator('h3[data-test="error"]');
  await errorMessage.waitFor({ state: "visible" });

  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toHaveText(
    "Epic sadface: Username and password do not match any user in this service"
  );
  await expect(usernameInput).toHaveClass(/error/);
  await expect(passwordInput).toHaveClass(/error/);
});

test("login with locked_out_user", async ({ page }) => {
  const usernameInput = page.locator(USERNAME_INPUT);
  const passwordInput = page.locator(PASSWORD_INPUT);
  const loginButton = page.locator(LOGIN_BUTTON);

  await usernameInput.fill("locked_out_user");
  await passwordInput.fill("secret_sauce");
  await loginButton.click();

  const errorMessage = page.locator('h3[data-test="error"]');
  await errorMessage.waitFor({ state: "visible" });

  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toHaveText(
    "Epic sadface: Sorry, this user has been locked out."
  );
  await expect(usernameInput).toHaveClass(/error/);
  await expect(passwordInput).toHaveClass(/error/);
});
