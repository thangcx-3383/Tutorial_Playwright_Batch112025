import test, { expect } from "@playwright/test";

test("todo list", async ({ page }) => {
  await page.goto("https://demo.playwright.dev/todomvc/");
  const todoInput = page.locator("input.new-todo");
  await expect(todoInput).toBeVisible();

  const todos = ["Task A", "Task B", "Task C"];
  for (const todo of todos) {
    await todoInput.fill(todo);
    await todoInput.press("Enter");
  }

  const todoItems = page.locator("ul.todo-list li");
  await expect(todoItems).toHaveCount(todos.length);

  const taskA = page.locator('label[data-testid="todo-title"]').first();
  await expect(taskA).toHaveText("Task A");

  const taskB = page.locator('label[data-testid="todo-title"]').nth(1);
  await expect(taskB).toHaveText("Task B");

  const taskC = page.locator('label[data-testid="todo-title"]').nth(2);
  await expect(taskC).toHaveText("Task C");

  // Check Task B
  const taskBCheckbox = page.locator("input.toggle").nth(1);
  await taskBCheckbox.check();

  await expect(taskBCheckbox).toBeChecked();

  // Delete Task C
  const taskCItem = todoItems.filter({ hasText: "Task C" });
  await taskCItem.hover();
  const deleteButton = taskCItem.locator("button.destroy");
  await expect(deleteButton).toBeVisible();
  await deleteButton.click();
  await expect(todoItems).toHaveCount(todos.length - 1);
});
