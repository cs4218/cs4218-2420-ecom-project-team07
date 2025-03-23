import { test, expect } from '@playwright/test';

test.describe('Categories Functionality Tests', () => {
  // Helper function to login as admin
  async function adminLogin(page) {
    await page.goto('http://localhost:3000/login');
    await page.getByPlaceholder('Enter Your Email').fill('cs4218@test.com');
    await page.getByPlaceholder('Enter Your Password').fill('cs4218@test.com');
    await page.getByRole('button', { name: 'LOGIN' }).click();
    await expect(page).toHaveURL('http://localhost:3000/', { timeout: 10000 });
  }

  test('Admin should be able to view categories page', async ({ page }) => {
    // Login as admin
    await adminLogin(page);
    
    // Navigate to admin dashboard
    await page.goto('http://localhost:3000/dashboard/admin');
    
    // Click on "Create Categories" link
    await page.getByRole('link', { name: 'Create Category' }).click();
    
    // Verify we're on the categories page
    await expect(page).toHaveURL(/create-category/);
    
    // Verify category form is visible
    await expect(page.getByText('Manage Category')).toBeVisible();
    await expect(page.getByPlaceholder('Enter new category')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  });

  test('Admin should be able to create a new category', async ({ page }) => {
    // Login as admin
    await adminLogin(page);
    
    // Navigate to categories page
    await page.goto('http://localhost:3000/dashboard/admin/create-category');
    
    // Generate unique category name
    const categoryName = `Test Category`;
    
    // Fill out the category form
    await page.getByPlaceholder('Enter new category').fill(categoryName);
    
    // Submit the form
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Verify success message
    await expect(page.locator('div.go2072408551')).toBeVisible({ timeout: 5000 });
    
    // Verify the new category appears in the list
    await expect(page.getByRole('cell', { name: categoryName })).toBeVisible({ timeout: 5000 });
  });

  test('Admin should be able to update a category', async ({ page }) => {
    // Login as admin
    await adminLogin(page);
    
    // Navigate to categories page
    await page.goto('http://localhost:3000/dashboard/admin/create-category');
    
    // Create a category to update
    const originalName = `Update Test 1`;
    await page.getByPlaceholder('Enter new category').fill(originalName);
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Wait for category to be created
    await expect(page.getByRole('cell', { name: originalName })).toBeVisible({ timeout: 5000 });
    
    // Use a more specific locator to find the exact row with our category
    // Find the table row that contains our unique category name
    const row = page.locator('tr', { has: page.getByText(originalName, { exact: true }) });
    
    // Click the Edit button within that specific row
    await row.getByRole('button', { name: 'Edit' }).click();
    
    // Update the category name
    const updatedName = `Update Test 2`;
    await page.getByRole('dialog').getByRole('textbox', { name: 'Enter new category' }).fill(updatedName);
    await page.getByRole('dialog').getByRole('button', { name: 'Submit' }).click();
    
    // Verify success message
    await expect(page.locator('div.go2072408551')).toBeVisible({ timeout: 5000 });
    
    // Verify the updated category appears in the list
    await expect(page.getByRole('cell', { name: updatedName })).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('cell', { name: originalName })).not.toBeVisible({ timeout: 5000 });
  });

  test('Admin should be able to delete a category', async ({ page }) => {
    // Login as admin
    await adminLogin(page);
    
    // Navigate to categories page
    await page.goto('http://localhost:3000/dashboard/admin/create-category');
    
    // Create a category to delete
    const categoryName = `Delete Test`;
    await page.getByPlaceholder('Enter new category').fill(categoryName);
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Wait for category to be created
    await expect(page.getByRole('cell', { name: categoryName })).toBeVisible({ timeout: 5000 });
    
    // Use a more specific locator to find the exact row with our category
    const row = page.locator('tr', { has: page.getByText(categoryName, { exact: true }) });
    
    // Click the Delete button within that specific row
    await row.getByRole('button', { name: 'Delete' }).click();
    
    // Confirm deletion in the modal
    await row.getByRole('button', { name: 'Delete' }).click();

    // Verify the category is removed from the list
    await expect(page.getByRole('cell', { name: categoryName })).not.toBeVisible({ timeout: 5000 });
  });

  test('Non-admin users should not access categories management page', async ({ page }) => {
    // Login as regular user
    await page.goto('http://localhost:3000/login');
    await page.getByPlaceholder('Enter Your Email').fill('user@test.com');
    await page.getByPlaceholder('Enter Your Password').fill('user@test.com');
    await page.getByRole('button', { name: 'LOGIN' }).click();
    
    // Try to navigate to admin categories page
    await page.goto('http://localhost:3000/dashboard/admin/create-category');
    
    // Verify user is redirected or access denied
    await expect(page).not.toHaveURL(/dashboard\/admin\/create-category/);
  });
});
