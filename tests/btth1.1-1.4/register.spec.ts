import { test, expect, Page } from "@playwright/test";
import { faker } from "@faker-js/faker";
import {
  UserDataTypeLogin,
  UserDataTypeRegister,
} from "../types/btth11_14.type";

const BASE_URL =
  "https://www.globalsqa.com/angularJs-protractor/registration-login-example/#/register";

const fillData = async (
  page: Page,
  userData: UserDataTypeRegister | UserDataTypeLogin
) => {
  if ("firstName" in userData) {
    await page.fill(
      'input[id="firstName"][name="firstName"]',
      userData.firstName
    );
  }
  if ("lastName" in userData) {
    await page.fill('input[id="Text1"][name="lastName"]', userData.lastName);
  }
  await page.fill('input[id="username"][name="username"]', userData.username);
  await page.fill('input[id="password"][name="password"]', userData.password);
};

const generateUserData = (): UserDataTypeRegister => {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    username: faker.internet.username(),
    password: faker.internet.password(),
  };
};

test.beforeEach(async ({ page }) => {
  await page.goto(BASE_URL);
});

test.afterEach(async ({ page }) => {
  await page.locator('a:has-text("Logout")').click();
});

const checkHeader = async (page: Page, headerText: string) => {
  const headerLocator = page.locator(`h2:has-text("${headerText}")`);
  await expect(headerLocator).toBeVisible();
};

const checkFormFieldRegister = async (page: Page) => {
  const firstNameField = page.locator(
    'input[id="firstName"][name="firstName"]'
  );
  await expect(firstNameField).toBeVisible();
  const lastNameField = page.locator('input[id="Text1"][name="lastName"]');
  await expect(lastNameField).toBeVisible();
  const usernameField = page.locator('input[id="username"][name="username"]');
  await expect(usernameField).toBeVisible();
  const passwordField = page.locator('input[id="password"][name="password"]');
  await expect(passwordField).toBeVisible();
  const btnSubmit = page.locator('button[type="submit"]');
  await expect(btnSubmit).toBeVisible();
};

const submitFormRegister = async (
  page: Page,
  userData: UserDataTypeRegister
) => {
  await fillData(page, userData);
  await page.click('button[type="submit"]');
  const successMessage = page.locator(
    'div.alert:has-text("Registration successful")'
  );
  await successMessage.waitFor({ state: "visible" });

  await expect(successMessage).toBeVisible();
  await expect(page).toHaveURL(/.*#\/login$/);
};

const checkFormFieldLogin = async (page: Page) => {
  const usernameField = page.locator('input[id="username"][name="username"]');
  await expect(usernameField).toBeVisible();
  const passwordField = page.locator('input[id="password"][name="password"]');
  await expect(passwordField).toBeVisible();
  const btnSubmit = page.locator('button[type="submit"]');
  await expect(btnSubmit).toBeVisible();
};

const submitFormLogin = async (page: Page, userData: UserDataTypeLogin) => {
  await fillData(page, userData);
  await page.click('button[type="submit"]');
  const successMessage = page.locator('p:has-text("You\'re logged in!!")');
  await successMessage.waitFor({ state: "visible" });

  await expect(successMessage).toBeVisible();
  await expect(page).toHaveURL(/.*#\/$/);
};

test("register account and login", async ({ page }) => {
  //Register
  await checkHeader(page, "Register");
  await checkFormFieldRegister(page);
  const userData = generateUserData();
  console.log(userData);
  await submitFormRegister(page, userData);

  //Login
  await checkHeader(page, "Login");
  await checkFormFieldLogin(page);
  await submitFormLogin(page, {
    username: userData.username,
    password: userData.password,
  });
});
