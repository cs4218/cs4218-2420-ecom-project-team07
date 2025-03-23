import { test, expect } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid'; // For generating unique emails

test.describe('Register Functionality Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the registration page before each test
    await page.goto('http://localhost:3000/register');
  });

  test('Page should load registration form correctly', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle(/Register - Ecommerce App/);
    
    // Verify form elements exist
    await expect(page.locator('h4.title')).toHaveText('REGISTER FORM');
    await expect(page.getByRole('button', { name: 'REGISTER' })).toBeVisible();
    
    // Verify all input fields are visible
    await expect(page.getByPlaceholder('Enter Your Name')).toBeVisible();
    await expect(page.getByPlaceholder('Enter Your Email')).toBeVisible();
    await expect(page.getByPlaceholder('Enter Your Password')).toBeVisible();
    await expect(page.getByPlaceholder('Enter Your Phone')).toBeVisible();
    await expect(page.getByPlaceholder('Enter Your Address')).toBeVisible();
    await expect(page.getByPlaceholder('Enter Your DOB')).toBeVisible();
    await expect(page.getByPlaceholder('What is Your Favorite Sports')).toBeVisible();
  });

  test('Successful registration should redirect to login page', async ({ page }) => {
    // Generate unique email to avoid duplicate registration
    const uniqueEmail = `test_${uuidv4().substring(0, 8)}@example.com`;
    
    // Fill out the form
    await page.getByPlaceholder('Enter Your Name').fill('Test User');
    await page.getByPlaceholder('Enter Your Email').fill(uniqueEmail);
    await page.getByPlaceholder('Enter Your Password').fill('password123');
    await page.getByPlaceholder('Enter Your Phone').fill('1234567890');
    await page.getByPlaceholder('Enter Your Address').fill('123 Test Street');
    await page.getByPlaceholder('Enter Your DOB').fill('2000-01-01');
    await page.getByPlaceholder('What is Your Favorite Sports').fill('Football');

    // Submit the form
    await page.getByRole('button', { name: 'REGISTER' }).click();

    // Wait for redirect or success message
    await expect(page).toHaveURL(/login/, { timeout: 10000 });
  });

  test('Registration with existing email should display error message', async ({ page }) => {
    // Use a known existing email
    const existingEmail = 'user@test.com'; // Assume this email already exists in the database
    
    // Fill out the form
    await page.getByPlaceholder('Enter Your Name').fill('Existing User');
    await page.getByPlaceholder('Enter Your Email').fill(existingEmail);
    await page.getByPlaceholder('Enter Your Password').fill('password123');
    await page.getByPlaceholder('Enter Your Phone').fill('1234567890');
    await page.getByPlaceholder('Enter Your Address').fill('123 Existing Street');
    await page.getByPlaceholder('Enter Your DOB').fill('2000-01-01');
    await page.getByPlaceholder('What is Your Favorite Sports').fill('Football');

    // Submit the form
    await page.getByRole('button', { name: 'REGISTER' }).click();

    // Verify error message
    await expect(page.locator('div.go3958317564')).toBeVisible({ timeout: 5000 });
    
    // Verify still on register page
    await expect(page).toHaveURL(/register/);
  });

  test('Form validation should prevent submission of empty fields', async ({ page }) => {
    // Attempt to submit empty form
    await page.getByRole('button', { name: 'REGISTER' }).click();
    
    // Verify form was not submitted (still on same page)
    await expect(page).toHaveURL(/register/);
    
    // Verify browser form validation (first required field gets focus)
    await expect(page.getByPlaceholder('Enter Your Name')).toBeFocused();
  });
  
  test('Should be able to login with newly created credentials after registration', async ({ page }) => {
    // Generate unique email
    const uniqueEmail = `test_${uuidv4().substring(0, 8)}@example.com`;
    const password = 'password123';
    
    // Fill out registration form
    await page.getByPlaceholder('Enter Your Name').fill('Login Test User');
    await page.getByPlaceholder('Enter Your Email').fill(uniqueEmail);
    await page.getByPlaceholder('Enter Your Password').fill(password);
    await page.getByPlaceholder('Enter Your Phone').fill('1234567890');
    await page.getByPlaceholder('Enter Your Address').fill('123 Login Test Street');
    await page.getByPlaceholder('Enter Your DOB').fill('2000-01-01');
    await page.getByPlaceholder('What is Your Favorite Sports').fill('Football');

    // Submit registration form
    await page.getByRole('button', { name: 'REGISTER' }).click();

    // Wait for redirect to login page
    await expect(page).toHaveURL(/login/, { timeout: 10000 });
    
    // Login with newly created credentials
    await page.getByPlaceholder('Enter Your Email').fill(uniqueEmail);
    await page.getByPlaceholder('Enter Your Password').fill(password);
    await page.getByRole('button', { name: 'LOGIN' }).click();
    
    // Verify successful login and redirect to homepage
    await expect(page).toHaveURL('http://localhost:3000/', { timeout: 10000 });
    
    // Verify user is logged in (e.g., check username in navigation bar)
    // await expect(page.locator('.user-info')).toContainText('Login Test User');
  });
});