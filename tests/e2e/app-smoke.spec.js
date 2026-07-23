const { test, expect } = require("@playwright/test");

test("app shell loads", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/TG collector - Telegram research tool/i);
  await expect(
    page.getByText("The Telegram collector you've been waiting for"),
  ).toBeVisible();
});
