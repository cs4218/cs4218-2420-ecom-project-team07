// @ts-check
import { test, expect } from '@playwright/test';

const Admin_Login = async (page) => {
    await page.goto("http://localhost:3000");
    await page.getByRole("link", { name: "Login" }).click();
    await page.getByRole("textbox", { name: "Enter Your Email" }).fill("cs4218@test.com");
    await page.getByRole("textbox", { name: "Enter Your Password" }).fill("cs4218@test.com");
    await page.getByRole("button", { name: "LOGIN" }).click();

    await expect(page.getByText("login successfully")).toBeVisible();
}

const User_Login = async (page) => {
    await page.goto("http://localhost:3000");
    await page.getByRole("link", { name: "Login" }).click();
    await page.getByRole("textbox", { name: "Enter Your Email" }).fill("test@gmail.com");
    await page.getByRole("textbox", { name: "Enter Your Password" }).fill("test@gmail.com");
    await page.getByRole("button", { name: "LOGIN" }).click();

    await expect(page.getByText("login successfully")).toBeVisible();
}

test.describe('Privacy Policy UI Test', () => {
    test('Privacy Policy page loads correctly', async ({page}) => {
        await page.goto("http://localhost:3000/policy");

        await expect(page.getByText("First Policy: ")).toBeVisible();
        await expect(page.getByText("Second Policy: ")).toBeVisible();
        await expect(page.getByText("Third Policy: ")).toBeVisible();
        await expect(page.getByText("Fourth Policy: ")).toBeVisible();
        await expect(page.getByText("Fifth Policy: ")).toBeVisible();
        await expect(page.getByText("Sixth Policy: ")).toBeVisible();
        await expect(page.getByText("Seventh Policy: ")).toBeVisible();
    });

    test('Privacy Policy page link loads Privacy Policy page correctly', async ({page}) => {
        await page.goto("http://localhost:3000");
        await page.waitForURL("http://localhost:3000");
        
        await page.getByRole("link", { name: "Privacy Policy" }).click();
        await page.waitForURL("http://localhost:3000/policy");

        await expect(page.getByText("First Policy: ")).toBeVisible();
        await expect(page.getByText("Second Policy: ")).toBeVisible();
        await expect(page.getByText("Third Policy: ")).toBeVisible();
        await expect(page.getByText("Fourth Policy: ")).toBeVisible();
        await expect(page.getByText("Fifth Policy: ")).toBeVisible();
        await expect(page.getByText("Sixth Policy: ")).toBeVisible();
        await expect(page.getByText("Seventh Policy: ")).toBeVisible();
    });

    test('Privacy Policy page loads correctly after Admin Logs in', async ({page}) => {
        await Admin_Login(page);
        
        await page.goto("http://localhost:3000/policy");

        await expect(page.getByText("First Policy: ")).toBeVisible();
        await expect(page.getByText("Second Policy: ")).toBeVisible();
        await expect(page.getByText("Third Policy: ")).toBeVisible();
        await expect(page.getByText("Fourth Policy: ")).toBeVisible();
        await expect(page.getByText("Fifth Policy: ")).toBeVisible();
        await expect(page.getByText("Sixth Policy: ")).toBeVisible();
        await expect(page.getByText("Seventh Policy: ")).toBeVisible();
    });

    test('Privacy Policy page link loads Privacy Policy page correctly after Admin Logs in', async ({page}) => {
        await Admin_Login(page);

        await page.goto("http://localhost:3000");
        await page.waitForURL("http://localhost:3000");
        
        await page.getByRole("link", { name: "Privacy Policy" }).click();
        await page.waitForURL("http://localhost:3000/policy");

        await expect(page.getByText("First Policy: ")).toBeVisible();
        await expect(page.getByText("Second Policy: ")).toBeVisible();
        await expect(page.getByText("Third Policy: ")).toBeVisible();
        await expect(page.getByText("Fourth Policy: ")).toBeVisible();
        await expect(page.getByText("Fifth Policy: ")).toBeVisible();
        await expect(page.getByText("Sixth Policy: ")).toBeVisible();
        await expect(page.getByText("Seventh Policy: ")).toBeVisible();
    });

    test('Privacy Policy page loads correctly after User Logs in', async ({page}) => {
        await User_Login(page);
        
        await page.goto("http://localhost:3000/policy");

        await expect(page.getByText("First Policy: ")).toBeVisible();
        await expect(page.getByText("Second Policy: ")).toBeVisible();
        await expect(page.getByText("Third Policy: ")).toBeVisible();
        await expect(page.getByText("Fourth Policy: ")).toBeVisible();
        await expect(page.getByText("Fifth Policy: ")).toBeVisible();
        await expect(page.getByText("Sixth Policy: ")).toBeVisible();
        await expect(page.getByText("Seventh Policy: ")).toBeVisible();
    });

    test('Privacy Policy page link loads Privacy Policy page correctly after User Logs in', async ({page}) => {
        await User_Login(page);

        await page.goto("http://localhost:3000");
        await page.waitForURL("http://localhost:3000");
        
        await page.getByRole("link", { name: "Privacy Policy" }).click();
        await page.waitForURL("http://localhost:3000/policy");

        await expect(page.getByText("First Policy: ")).toBeVisible();
        await expect(page.getByText("Second Policy: ")).toBeVisible();
        await expect(page.getByText("Third Policy: ")).toBeVisible();
        await expect(page.getByText("Fourth Policy: ")).toBeVisible();
        await expect(page.getByText("Fifth Policy: ")).toBeVisible();
        await expect(page.getByText("Sixth Policy: ")).toBeVisible();
        await expect(page.getByText("Seventh Policy: ")).toBeVisible();
    });
});