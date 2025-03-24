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

const Add_To_Cart_Novel = async (page) => {
    await page.goto("http://localhost:3000");
    await page.getByRole('button', { name: 'ADD TO CART' }).nth(0).click(); // Clicks the first button with the name 'ADD TO CART'
    
    // Check for the Toast notification
    const toastNotification = page.locator('text=Item Added to cart');
    await expect(toastNotification).toBeVisible();
}

const Add_To_Cart_Law = async (page) => {
    await page.goto("http://localhost:3000");
    await page.getByRole('button', { name: 'ADD TO CART' }).nth(1).click(); // Clicks the second button with the name 'ADD TO CART'
    
    // Check for the Toast notification
    const toastNotification = page.locator('text=Item Added to cart');
    await expect(toastNotification).toBeVisible();
}

const Remove_First_From_Cart = async (page) => {
    await page.goto("http://localhost:3000/cart");
    await page.getByRole('button', { name: 'Remove' }).nth(0).click();
}

test.describe('About UI Test', () => {

    test('Cart Page loads correctly without any addition of items', async ({page}) => {
        await page.goto("http://localhost:3000/cart");

        await expect(page.getByText("Cart Summary")).toBeVisible();
    });

    test('Test if added Novel appear on the Cart Page', async ({page}) => {
        await Add_To_Cart_Novel(page);
        await page.goto("http://localhost:3000/cart");
        
        // Check for the visibility of a <p> element with specific text
        const paragraph = page.locator('p', { hasText: 'A bestselling novel' });
        await expect(paragraph).toBeVisible();

    });

    test('Test if added Law book appear on the Cart Page', async ({page}) => {
        await Add_To_Cart_Law(page);
        await page.goto("http://localhost:3000/cart");
        
        // Check for the visibility of a <p> element with specific text
        const paragraph = page.locator('p', { hasText: 'Law of Contract' });
        await expect(paragraph).toBeVisible();

    });

    test('Test if clicking "Update Address" button brings me to correct page', async ({ page }) => {
        await User_Login(page);
        await page.goto("http://localhost:3000/cart");

        // Click the "Update Address" button
        await page.getByRole('button', { name: 'Update Address' }).click();

        // Check if the URL is correct
        await expect(page).toHaveURL('http://localhost:3000/dashboard/user/profile');
    });

    test('Test if clicking the "Remove" button will remove the item from cart', async ({ page }) => {
        // Add a Novel to the cart
        await Add_To_Cart_Novel(page);
        await page.goto("http://localhost:3000/cart");

        await Remove_First_From_Cart(page)
        
        // Check that the <p> element with text "A bestselling novel" is no longer visible
        const paragraph = page.locator('p', { hasText: 'A bestselling novel' });
        await expect(paragraph).toBeHidden();
        
    });

    test('Test if the cost of Novel and Law adds up correctly on cart page', async ({ page }) => {
        // Add a Novel to the cart
        await Add_To_Cart_Novel(page);
        await Add_To_Cart_Law(page);
        await page.goto("http://localhost:3000/cart");

        
        
        // Check if the cost adds up to $69.98
        const h4Text = page.locator('h4:has-text("$69.98")');
        await expect(h4Text).toBeVisible();
        
    });

});