import { expect } from "@playwright/test";
import { test as testSaucedemo } from "../fixtures/login.fixture";

testSaucedemo.describe("Product Page Tests", () => {
  testSaucedemo(
    "check if 6 products are displayed on the products page",
    async ({ loggedInPage }) => {
      const productItems = loggedInPage.locator(".inventory_item");
      const itemCount = await productItems.count();
      expect(itemCount).toBe(6);
    }
  );

  testSaucedemo(
    "first product name is 'Sauce Labs Backpack'",
    async ({ loggedInPage }) => {
      const firstProductName = loggedInPage
        .locator(".inventory_item_name")
        .first();
      await expect(firstProductName).toHaveText("Sauce Labs Backpack");
    }
  );
});

testSaucedemo.describe("Cart Functionality Tests", () => {
  testSaucedemo("add product to cart success", async ({ loggedInPage }) => {
    const addToCartButton = loggedInPage.locator(
      'button[id="add-to-cart-sauce-labs-backpack"]'
    );
    await addToCartButton.click();

    const cartBadge = loggedInPage.locator("span.shopping_cart_badge");
    await cartBadge.waitFor({ state: "visible" });

    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toHaveText("1");

    const addToCartButton2 = loggedInPage.locator(
      'button[id="add-to-cart-sauce-labs-bike-light"]'
    );
    await addToCartButton2.click();

    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toHaveText("2");

    const removeCartButton = loggedInPage.locator(
      'button[id="remove-sauce-labs-backpack"]'
    );
    await removeCartButton.click();

    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toHaveText("1");
  });
});
