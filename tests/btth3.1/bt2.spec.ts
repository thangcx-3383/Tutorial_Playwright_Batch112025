import test, { expect } from "@playwright/test";

const BASE_URL = "https://www.saucedemo.com/";

const USERNAME_INPUT = 'input[id="user-name"][name="user-name"]';
const PASSWORD_INPUT = 'input[id="password"][name="password"]';
const LOGIN_BUTTON = 'input[id="login-button"]';

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
    await expect(cartBadge).toHaveText("1");
  });
});
