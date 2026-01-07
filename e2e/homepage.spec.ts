import { test, expect } from "@playwright/test";

test.describe("Home page (App Router)", () => {
  test("loads and shows semantic structure", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("navigation")).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });

  test("navbar contains logo + items (desktop)", async ({ page }) => {
    await page.goto("/");

    const nav = page.getByRole("navigation");

    // Logo is a LINK named "AI Mesh" (not the hero heading)
    await expect(nav.getByRole("link", { name: "AI Mesh" })).toBeVisible();

    // These are <a href="#"> so they are also links
    await expect(nav.getByRole("link", { name: "Features" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Pricing" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "About" })).toBeVisible();

    // Login is a Link too
    await expect(nav.getByRole("link", { name: /log in/i })).toBeVisible();
  });

  test("hero section contains heading, description and CTA links", async ({
    page,
  }) => {
    await page.goto("/");

    // Hero title is an H1
    const heroHeading = page.getByRole("heading", {
      name: "AI Mesh",
      level: 1,
    });
    await expect(heroHeading).toBeVisible();

    await expect(
      page.getByText(/Harness the power of next-generation conversational AI/i)
    ).toBeVisible();

    // CTA buttons are Next Links -> rendered as links in the DOM
    await expect(page.getByRole("link", { name: "Start Here" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Try Playground" })
    ).toBeVisible();
  });

  test("footer shows copyright and policy links", async ({ page }) => {
    await page.goto("/");

    const year = new Date().getFullYear();

    await expect(
      page.getByText(`© ${year} AI Mesh. All rights reserved.`)
    ).toBeVisible();

    await expect(
      page.getByRole("link", { name: "Privacy Policy" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Terms of Service" })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Contact Us" })).toBeVisible();
  });

  test("hero container has animated gradient class", async ({ page }) => {
    await page.goto("/");

    // Your HeroSection root div includes `animated-gradient`
    await expect(page.locator(".animated-gradient")).toBeVisible();
  });
});
