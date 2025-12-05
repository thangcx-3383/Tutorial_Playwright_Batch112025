import { test, expect } from "@playwright/test";

test("codegen test", async ({ page }) => {
  await page.goto("https://demo.playwright.dev/todomvc/#/");
  await page
    .getByRole("textbox", { name: "What needs to be done?" })
    .fill("Task A");
  await page
    .getByRole("textbox", { name: "What needs to be done?" })
    .press("Enter");
  await page
    .getByRole("textbox", { name: "What needs to be done?" })
    .fill("Task B");
  await page
    .getByRole("textbox", { name: "What needs to be done?" })
    .press("Enter");
  await page
    .getByRole("textbox", { name: "What needs to be done?" })
    .fill("Task C");
  await page
    .getByRole("textbox", { name: "What needs to be done?" })
    .press("Enter");

  await expect(page.locator(".todo-list li")).toHaveCount(3);

  await page
    .getByRole("listitem")
    .filter({ hasText: "Task C" })
    .getByLabel("Toggle Todo")
    .check();
  await page.getByRole("link", { name: "Active" }).click();

  await expect(page.locator(".todo-list li")).toHaveCount(2);

  await page.getByRole("link", { name: "Completed" }).click();

  await expect(page.locator(".todo-list li")).toHaveCount(1);

  await page.getByRole("link", { name: "All" }).click();
  await page
    .getByRole("listitem")
    .filter({ hasText: "Task A" })
    .getByLabel("Toggle Todo")
    .check();

  await page.getByRole("link", { name: "Active" }).click();
  await expect(page.locator(".todo-list li")).toHaveCount(1);

  await page.getByRole("link", { name: "Completed" }).click();
  await expect(page.locator(".todo-list li")).toHaveCount(2);
});
