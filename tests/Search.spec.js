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

test.describe('Search UI Test',  () => {
    test.beforeEach(async ({page}) => {
        await Login(page);
    });
    
    test('Search the product that exists (from homepage)', async ({page}) => {
        await page.goto("http://localhost:3000");
        
        await page.getByRole("searchbox", { name: "Search" }).click();
        await page.getByRole("searchbox", { name: "Search" }).fill("Laptop");
        await page.getByRole("button", { name: "Search" }).click();
        await page.waitForURL("http://localhost:3000/search");

        await expect(page.getByRole("heading", { name: "Search Results" })).toBeVisible();
        await expect(page.getByRole("heading", { name: "Found 1" })).toBeVisible();
        await expect(page.getByRole("heading", { name: "Laptop" })).toBeVisible();
        await expect(page.getByText("A powerful laptop")).toBeVisible();
        await expect(page.getByText("$ 1499.99")).toBeVisible();
    });

    test('Search the product that exists (from search page)', async ({page}) => {
        await page.goto("http://localhost:3000/search");
        
        await page.getByRole("searchbox", { name: "Search" }).click();
        await page.getByRole("searchbox", { name: "Search" }).fill("Laptop");
        await page.getByRole("button", { name: "Search" }).click();

        await expect(page.getByRole("heading", { name: "Search Results" })).toBeVisible();
        await expect(page.getByRole("heading", { name: "Found 1" })).toBeVisible();
        await expect(page.getByRole("heading", { name: "Laptop" })).toBeVisible();
        await expect(page.getByText("A powerful laptop")).toBeVisible();
        await expect(page.getByText("$ 1499.99")).toBeVisible();
    });

    test('Search the product that does not exist (from homepage)', async ({page}) => {
        await page.goto("http://localhost:3000");

        await page.getByRole("searchbox", { name: "Search" }).click();
        await page.getByRole("searchbox", { name: "Search" }).fill("Desktop");
        await page.getByRole("button", { name: "Search" }).click();
        await page.waitForURL("http://localhost:3000/search");

        await expect(page.getByRole("heading", { name: "Search Results" })).toBeVisible();
        await expect(page.getByRole("heading", { name: "No Products Found" })).toBeVisible();
    });

    test('Search the product that does not exist (from search page)', async ({page}) => {
        await page.goto("http://localhost:3000/search");

        await page.getByRole("searchbox", { name: "Search" }).click();
        await page.getByRole("searchbox", { name: "Search" }).fill("Desktop");
        await page.getByRole("button", { name: "Search" }).click();

        await expect(page.getByRole("heading", { name: "Search Results" })).toBeVisible();
        await expect(page.getByRole("heading", { name: "No Products Found" })).toBeVisible();
    });

    test('Search two products that exists (from homepage)', async ({page}) => {
        await page.goto("http://localhost:3000");

        await page.getByRole("searchbox", { name: "Search" }).click();
        await page.getByRole("searchbox", { name: "Search" }).fill("rt");
        await page.getByRole("button", { name: "Search" }).click();
        await page.waitForURL("http://localhost:3000/search");

        await expect(page.getByRole("heading", { name: "Search Results" })).toBeVisible();
        await expect(page.getByRole("heading", { name: "Found 2" })).toBeVisible();
        
        await expect(page.getByRole("heading", { name: "Smartphone" })).toBeVisible();
        await expect(page.getByText("A high-end smartphone")).toBeVisible();
        await expect(page.getByText("$ 999.99")).toBeVisible();

        await expect(page.getByRole("heading", { name: "NUS T-shirt" })).toBeVisible();
        await expect(page.getByText("Plain NUS T-shirt for sale")).toBeVisible();
        await expect(page.getByText("$ 4.99")).toBeVisible();
    });
});