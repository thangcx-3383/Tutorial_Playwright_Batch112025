import test, { expect } from "@playwright/test";

const BASE_URL = "https://www.saucedemo.com/";

const USERNAME_INPUT = 'input[id="user-name"][name="user-name"]';
const PASSWORD_INPUT = 'input[id="password"][name="password"]';
const LOGIN_BUTTON = 'input[id="login-button"]';

test.beforeAll(async () => {
  console.log("Starting Tests");
});

test.afterAll(async () => {
  console.log("Tests Completed");
});

test.describe("Product Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
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

  test.afterEach(async ({ page }) => {
    const menuButton = page.locator('button[id="react-burger-menu-btn"]');
    await menuButton.click();

    const logoutLink = page.locator('a[id="logout_sidebar_link"]');
    await logoutLink.waitFor({ state: "visible" });
    await logoutLink.click();

    const loginButton = page.locator(LOGIN_BUTTON);
    await loginButton.waitFor({ state: "visible" });

    await expect(loginButton).toBeVisible();
    await expect(page).toHaveURL(BASE_URL);
  });

  test("check if 6 products are displayed on the products page", async ({
    page,
  }) => {
    const productItems = page.locator(".inventory_item");
    const itemCount = await productItems.count();
    expect(itemCount).toBe(6);
  });

  test("first product name is 'Sauce Labs Backpack'", async ({ page }) => {
    const firstProductName = page.locator(".inventory_item_name").first();
    await expect(firstProductName).toHaveText("Sauce Labs Backpack");
  });
});

test.describe("Cart Functionality Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    const usernameInput = page.locator(USERNAME_INPUT);
    const passwordInput = page.locator(PASSWORD_INPUT);
    const loginButton = page.locator(LOGIN_BUTTON);

    await usernameInput.fill("visual_user");
    await passwordInput.fill("secret_sauce");
    await loginButton.click();

    await expect(page).toHaveURL(/.*\/inventory.html$/);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const browserName = testInfo.project.name;
      await page.screenshot({
        path: `./test-results/screenshot/${testInfo.title.replace(
          /\s+/g,
          "_"
        )}_${browserName}_${testInfo.status}.png`,
      });
    }
  });

  test("add product to cart success", async ({ page }) => {
    const addToCartButton = page.locator(
      'button[id="add-to-cart-sauce-labs-backpack"]'
    );
    await addToCartButton.click();

    const cartBadge = page.locator("span.shopping_cart_badge");
    await cartBadge.waitFor({ state: "visible" });

    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toHaveText("1");

    const addToCartButton2 = page.locator(
      'button[id="add-to-cart-sauce-labs-bike-light"]'
    );
    await addToCartButton2.click();

    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toHaveText("2");

    const removeCartButton = page.locator(
      'button[id="remove-sauce-labs-backpack"]'
    );
    await removeCartButton.click();

    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toHaveText("xxx"); // 1 is correct, change to xxx to make it fail
  });
});
