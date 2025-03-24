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

// I will use the T-Shirt and Laptop products as samples for the product details page
test.describe('About UI Test', () => {

    test('The product page should have "Name", "Description", "Price", "Category" displayed', async ({page}) => {
        await page.goto("http://localhost:3000/product/nus-tshirt");

        // Check if "Name", "Description", "Price", "Category" displayed' as H6 components
        await expect(page.getByRole('heading', { level: 6, name: 'Name' })).toBeVisible();
        await expect(page.getByRole('heading', { level: 6, name: 'Description' })).toBeVisible();
        await expect(page.getByRole('heading', { level: 6, name: 'Price' })).toBeVisible();
        await expect(page.getByRole('heading', { level: 6, name: 'Category' })).toBeVisible();
    });

    // If logged out, the "ADD TO CART" button should take you to log-in page "http://localhost:3000/login"
    test('If logged out, the "ADD TO CART" button should take you to log-in', async ({page}) => {
        await page.goto("http://localhost:3000/product/nus-tshirt");

        // Click the "ADD TO CART" button
        await page.getByRole('button', { name: 'ADD TO CART' }).click();

        // Check if the URL is correct
        await expect(page).toHaveURL('http://localhost:3000/login');
    });

    test('If logged in, the "ADD TO CART" button should add the laptop to cart', async ({page}) => {
        await User_Login(page);
        await page.goto("http://localhost:3000/product/laptop");

        // Click the "ADD TO CART" button
        await page.getByRole('button', { name: 'ADD TO CART' }).click();

        // Check if the cart is updated with item
        await page.goto("http://localhost:3000/cart");
        const paragraph = page.locator('p', { hasText: 'laptop' });
        await expect(paragraph).toBeVisible();
    });

    // test('Clicking on the Orders link should take you to this URL "http://localhost:3000/dashboard/user/orders" ', async ({page}) => {
    //     await User_Login(page);
    //     await page.goto("http://localhost:3000/dashboard/user/profile");

    //     // Click the "Orders" link
    //     await page.getByRole('link', { name: 'Orders' }).click();

    //     // Check if the URL is correct
    //     await expect(page).toHaveURL('http://localhost:3000/dashboard/user/orders');
    // });


});