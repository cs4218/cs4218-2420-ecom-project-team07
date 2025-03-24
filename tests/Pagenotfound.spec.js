import { expect, test } from "@playwright/test";
import { loginAdmin, loginUser } from "../test-utils/playwright.js";



async function verifyPageText(page) {
	await expect(page.getByText("Oops! Page Not Found")).toBeVisible();
	await expect(page.getByText("Go Back")).toBeVisible();
}

test.describe('404 page tests', () => {
	test('loads successfully for guests', async ({ page }) => {
		await page.goto("http://localhost:3000/nosuch");

		await verifyPageText(page);
	});

	test('loads successfully for users', async ({page}) => {
		await loginUser(page);

		await page.goto("http://localhost:3000/nosuch");

		await verifyPageText(page);
	});

	test('loads successfully for admins', async ({page}) => {
		await loginAdmin(page);

		await page.goto("http://localhost:3000/nosuch");

		await verifyPageText(page);
	});
});
