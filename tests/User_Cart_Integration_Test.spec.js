// @ts-check
import { test, expect, chromium } from '@playwright/test';


const User_Login = async (page) => {
    await page.goto("http://localhost:3000");
    await page.getByRole("link", { name: "Login" }).click();
    await page.getByRole("textbox", { name: "Enter Your Email" }).fill("kc@kc.com");
    await page.getByRole("textbox", { name: "Enter Your Password" }).fill("kc");
    await page.getByRole("button", { name: "LOGIN" }).click();

    await expect(page.getByText("login successfully")).toBeVisible();
}

const Add_To_Cart_Novel = async (page) => {
    await page.goto("http://localhost:3000");
    await page.getByRole('button', { name: 'ADD TO CART' }).nth(0).click(); // Clicks the first button with the name 'ADD TO CART'
    
    // Check for the Toast notification
    const toastNotification = page.locator('text=Item Added to cart');
    await expect(toastNotification).toBeVisible();
}

test.describe('User Cart Integration Test', () => {

    // This test aims to test the update of the user display name. This will ensure the database has been properly updated once when the user desires so.
    test('Cart Data Persistance', async ({page}) => {
        await User_Login(page);

        await page.goto("http://localhost:3000/dashboard/user/profile");

        await page.getByPlaceholder('Enter Your Name').fill('kcyo');

        await page.getByRole('button', { name: 'UPDATE' }).click();

        await page.goto("http://localhost:3000/dashboard/user");

        // Check for the visibility of a <h3> element with specific text
        const header = page.locator('h3', { hasText: 'kcyo' });
        await expect(header).toBeVisible();
    });



});