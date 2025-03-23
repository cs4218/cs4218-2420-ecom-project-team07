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


test.describe('About UI Test', () => {

    test('If not logged in, the page redirects you to "http://localhost:3000/" in 4 seconds', async ({page}) => {
        await page.goto("http://localhost:3000/dashboard/user/profile");

        // Wait for 4 seconds
        await page.waitForTimeout(4000);

        // Check if the URL is redirected to the homepage
        await expect(page).toHaveURL("http://localhost:3000/");
    });

    test('If logged in, the URL remains, and the "User Profile" box should be visible', async ({page}) => {
        await User_Login(page);
        await page.goto("http://localhost:3000/dashboard/user/profile");

        // Check if the "USER PROFILE" box is visible
        const userProfileBox = page.locator('h4:has-text("USER PROFILE")');
        await expect(userProfileBox).toBeVisible();
    });

    test('Clicking on the Orders link should take you to this URL "http://localhost:3000/dashboard/user/orders" ', async ({page}) => {
        await User_Login(page);
        await page.goto("http://localhost:3000/dashboard/user/profile");

        // Click the "Orders" link
        await page.getByRole('link', { name: 'Orders' }).click();

        // Check if the URL is correct
        await expect(page).toHaveURL('http://localhost:3000/dashboard/user/orders');
    });


});