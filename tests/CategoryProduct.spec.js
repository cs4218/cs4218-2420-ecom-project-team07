// @ts-check
import { test, expect } from '@playwright/test';


const User_Login = async (page) => {
    await page.goto("http://localhost:3000");
    await page.getByRole("link", { name: "Login" }).click();
    await page.getByRole("textbox", { name: "Enter Your Email" }).fill("test@gmail.com");
    await page.getByRole("textbox", { name: "Enter Your Password" }).fill("test@gmail.com");
    await page.getByRole("button", { name: "LOGIN" }).click();

    await expect(page.getByText("login successfully")).toBeVisible();
}

// I will use the Book and Electronics category as a sample for testing
test.describe('About UI Test', () => {

    test('Book page should display "result found"', async ({page}) => {
        await page.goto("http://localhost:3000/category/book");

        // Check if 'result found' is visible
        await expect(page.getByRole('heading', { level: 6, name: 'result found' })).toBeVisible();
    });

    test('Book page More details button"', async ({page}) => {
        await page.goto("http://localhost:3000/category/book");

        // Clicking on the first "More Details" button will take you to the linked page
        const moreDetailsButton = page.getByRole('button', { name: 'More Details' }).first();
        await moreDetailsButton.click();

        // Check if the URL has changed to the product details page
        await expect(page).not.toHaveURL("http://localhost:3000/category/book");
    });

    test('Electronics page should display "result found"', async ({page}) => {
        await page.goto("http://localhost:3000/category/electronics");

        // Check if 'result found' is visible
        await expect(page.getByRole('heading', { level: 6, name: 'result found' })).toBeVisible();
    });

    test('Electronics page more details button"', async ({page}) => {
        await page.goto("http://localhost:3000/category/electronics");

        // Clicking on the first "More Details" button will take you to the linked page
        const moreDetailsButton = page.getByRole('button', { name: 'More Details' }).first();
        await moreDetailsButton.click();

        // Check if the URL has changed to the product details page
        await expect(page).not.toHaveURL("http://localhost:3000/category/electronics");
    });

});