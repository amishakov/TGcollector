const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");
const { loadSetupEnv } = require("./utils/env");

const AUTH_STATE_FILE = path.resolve(process.cwd(), ".auth/auth-state.json");

async function hasPersistedTelegramSession(page) {
  return page.evaluate(() => {
    try {
      const persisted = JSON.parse(localStorage.getItem("persist:root") || "{}");
      const user = JSON.parse(persisted.user || "{}");

      return Boolean(user.logged && user.session && user.api);
    } catch {
      return false;
    }
  });
}

test.describe("login setup", () => {
  test("login credentials open Telegram login flow", async ({
    page,
    context,
  }) => {
    // Setup may require manual QR scan / 2FA, so allow a longer timeout.
    test.setTimeout(5 * 60 * 1000);

    if (fs.existsSync(AUTH_STATE_FILE)) {
      return;
    }

    const env = loadSetupEnv();

    if (!env.ready) {
      throw new Error(
        `Missing env vars: ${env.missing.join(", ")}. Create .env.test.local (or .env) using .env.test.example and fill values.`,
      );
    }

    await page.goto("/");
    await page.getByRole("button", { name: "Login to Telegram" }).click();

    await page.getByLabel("API ID").fill(String(env.apiId));
    await page.getByLabel("API Hash").fill(String(env.apiHash));
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByText("Login by QR code")).toBeVisible({
      timeout: 30000,
    });

    await expect(page.getByText("Logged in as")).toBeVisible({
      timeout: 180000,
    });

    // Redux Persist writes asynchronously. Do not snapshot storage until the
    // Telegram session has made it into localStorage for the next project.
    await expect
      .poll(() => hasPersistedTelegramSession(page), { timeout: 10000 })
      .toBe(true);

    fs.mkdirSync(path.dirname(AUTH_STATE_FILE), { recursive: true });
    await context.storageState({ path: AUTH_STATE_FILE });
  });
});
