import { test, expect } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/ar/");
  await expect(page.locator("header")).toBeVisible();
});

test("search page accepts query", async ({ page }) => {
  await page.goto("/search?q=شباب");
  await expect(page.getByRole("tab", { name: /الكل|All/i })).toBeVisible({ timeout: 10000 });
});

test("login page renders", async ({ page }) => {
  await page.goto("/auth/login");
  await expect(page.getByLabel(/البريد|email/i)).toBeVisible();
});
