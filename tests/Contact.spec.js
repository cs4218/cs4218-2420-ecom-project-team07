import { expect, test } from "@playwright/test";
import { loginAdmin, loginUser } from "../test-utils/playwright.js";



async function verifyPageText(page) {
	await expect(page.getByText("contact@virtualvault.com")).toBeVisible();
	await expect(page.getByText("+65 6246 7050")).toBeVisible();
	await expect(page.getByText("1800-6565-6565")).toBeVisible();
}

test.describe('contact us page tests', () => {
	test('loads successfully for guests', async ({ page }) => {
		await page.goto("http://localhost:3000/contact");

		await verifyPageText(page);
	});

	test('loads successfully for users', async ({page}) => {
		await loginUser(page);

		await page.goto("http://localhost:3000/contact");

		await verifyPageText(page);
	});

	test('loads successfully for admins', async ({page}) => {
		await loginAdmin(page);

		await page.goto("http://localhost:3000/contact");

		await verifyPageText(page);
	});
});
