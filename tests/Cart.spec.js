// @ts-check
import { test, expect } from '@playwright/test';

const Login = async (page) => {
    await page.goto("http://localhost:3000");
    await page.getByRole("link", { name: "Login" }).click();
    await page.getByRole("textbox", { name: "Enter Your Email" }).fill("test@gmail.com");
    await page.getByRole("textbox", { name: "Enter Your Password" }).fill("test@gmail.com");
    await page.getByRole("button", { name: "LOGIN" }).click();

    await expect(page.getByText("login successfully")).toBeVisible();
}

test.describe('Cart UI & Integration Test', () => {
    test.beforeEach(async ({page}) => {
        await Login(page);
    });

    test('Add products to cart and Pay successfully', async ({page}) => {
        const AddToCart_Laptop = 
            page.locator(".card")
                .filter({ hasText: /Laptop/ })
                .first()
                .getByText("Add to cart");

        const AddToCart_Textbook = 
            page.locator(".card")
                .filter({ hasText: /Textbook/ })
                .first()
                .getByText("Add to cart");
        
        await expect(page.getByText("All Products")).toBeVisible();
        await expect.poll(
            async () => await page.getByText("More Details").count(),
            {
                timeout: 10000,
                message: "Loading..."
            }
        ).toBeGreaterThan(0);

        await AddToCart_Laptop.click();
        await AddToCart_Textbook.click();

        await expect(page.getByRole("superscript")).toContainText("2");
        await page.getByRole("link", { name: "Cart" }).click();
        await expect(page.getByText("Hello test@gmail.com")).toBeVisible();
        await expect(page.getByText("You have 2 items in your cart")).toBeVisible();
        await expect(page.getByText("Total : $1,579.98")).toBeVisible();

        const Button_Card = page.getByRole("button", { name: "Paying with Card" });
        await expect(Button_Card).toBeVisible({ timeout: 10000 });
        await Button_Card.click();

        await page.frameLocator('iframe[name="braintree-hosted-field-number"]')
                  .getByRole("textbox", { name: "Card Number" })
                  .fill("4242424242424242");
        await page.waitForSelector('iframe[name="braintree-hosted-field-expirationDate"]');
        await page.frameLocator('iframe[name="braintree-hosted-field-expirationDate"]')
                  .getByRole("textbox", { name: "Expiration Date"})
                  .fill("04/30");
        await page.waitForSelector('iframe[name="braintree-hosted-field-cvv"]');
        await page.frameLocator('iframe[name="braintree-hosted-field-cvv"]')
                  .getByRole("textbox", { name: "CVV"})
                  .fill("123");


        await page.getByText("Make Payment").click();
        await expect(page.getByText("Payment Completed Successfully")).toBeVisible();

        await expect(page.getByText("All Orders")).toBeVisible();

        await expect(page.locator(".container").first()).toBeVisible({ timeout: 10000 });
        await expect(page.locator(".container").first()).toContainText("Laptop");
        await expect(page.locator(".container").first()).toContainText("Textbook");
    });
});
