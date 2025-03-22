import { test, expect } from '@playwright/test';

test.describe('Login Functionality Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page before each test
    await page.goto('http://localhost:3000/login');
  });

  test('Page should load login form correctly', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle(/Login - Ecommerce App/);
    
    // Verify form elements exist
    await expect(page.locator('h4.title')).toHaveText('LOGIN FORM');
    await expect(page.getByRole('button', { name: 'LOGIN' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Forgot Password' })).toBeVisible();
    
    // Verify all input fields are visible
    await expect(page.getByPlaceholder('Enter Your Email')).toBeVisible();
    await expect(page.getByPlaceholder('Enter Your Password')).toBeVisible();
  });

  test('Successful login should redirect to homepage', async ({ page }) => {
    // Fill out the form with valid credentials
    await page.getByPlaceholder('Enter Your Email').fill('user@test.com');
    await page.getByPlaceholder('Enter Your Password').fill('user@test.com');

    // Submit the form
    await page.getByRole('button', { name: 'LOGIN' }).click();

    // Verify success message
    await expect(page.locator('div.go2072408551')).toBeVisible();
    
    // Verify redirect to homepage
    await expect(page).toHaveURL('http://localhost:3000/');
  });

  test('Failed login should display error message', async ({ page }) => {
    // Fill out the form with invalid credentials
    await page.getByPlaceholder('Enter Your Email').fill('wrong@example.com');
    await page.getByPlaceholder('Enter Your Password').fill('wrongpassword');

    // Submit the form
    await page.getByRole('button', { name: 'LOGIN' }).click();

    // Verify error message appears
    await expect(page.locator('div.go3958317564')).toBeVisible({ timeout: 5000 });
    
    // Verify still on login page
    await expect(page).toHaveURL(/login/);
  });

  test('Form validation should prevent submission of empty fields', async ({ page }) => {
    // Attempt to submit empty form
    await page.getByRole('button', { name: 'LOGIN' }).click();
    
    // Verify form was not submitted (still on same page)
    await expect(page).toHaveURL(/login/);
    
    // Verify browser form validation (first required field gets focus)
    await expect(page.getByPlaceholder('Enter Your Email')).toBeFocused();
  });

  test('Forgot Password button should navigate to forgot password page', async ({ page }) => {
    // Click the Forgot Password button
    await page.getByRole('button', { name: 'Forgot Password' }).click();
    
    // Verify navigation to forgot password page
    await expect(page).toHaveURL(/forgot-password/);
  });

  test('User can type in email and password fields', async ({ page }) => {
    // Type in email field
    await page.getByPlaceholder('Enter Your Email').fill('test@example.com');
    
    // Type in password field
    await page.getByPlaceholder('Enter Your Password').fill('password123');
    
    // Verify the values were entered correctly
    await expect(page.getByPlaceholder('Enter Your Email')).toHaveValue('test@example.com');
    await expect(page.getByPlaceholder('Enter Your Password')).toHaveValue('password123');
  });
});