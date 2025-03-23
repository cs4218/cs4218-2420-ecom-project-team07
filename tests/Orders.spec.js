import { test, expect } from '@playwright/test';

test.describe('Orders Functionality Tests', () => {
  // Helper function to login as user
  async function userLogin(page) {
    await page.goto('http://localhost:3000/login');
    await page.getByPlaceholder('Enter Your Email').fill('user@test.com');
    await page.getByPlaceholder('Enter Your Password').fill('user@test.com');
    await page.getByRole('button', { name: 'LOGIN' }).click();
    await expect(page).toHaveURL('http://localhost:3000/', { timeout: 10000 });
  }

  // Helper function to login as admin
  async function adminLogin(page) {
    await page.goto('http://localhost:3000/login');
    await page.getByPlaceholder('Enter Your Email').fill('cs4218@test.com');
    await page.getByPlaceholder('Enter Your Password').fill('cs4218@test.com');
    await page.getByRole('button', { name: 'LOGIN' }).click();
    await expect(page).toHaveURL('http://localhost:3000/', { timeout: 10000 });
  }

  test('User should be able to view their orders', async ({ page }) => {
    // Login as user
    await userLogin(page);
    
    // Navigate to user dashboard
    await page.goto('http://localhost:3000/dashboard/user');
    
    // Click on "Orders" link
    await page.getByRole('link', { name: 'Orders' }).click();
    
    // Verify we're on the orders page
    await expect(page).toHaveURL(/dashboard\/user\/orders/);
    
    // Verify orders page elements
    await expect(page.getByRole('heading', { name: 'All Orders' })).toBeVisible();
    
    // Check if orders table is visible or "No Orders Found" message
    const hasOrders = await page.getByText('No Orders Found').isHidden().catch(() => false);
    
    // In the 'User should be able to view their orders' test
    if (hasOrders) {
      // If user has orders, verify table headers
      // Use first() to specifically target the first matching element
      await expect(page.getByRole('columnheader', { name: '#' }).first()).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'Status' }).first()).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'Buyer' }).first()).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'Date' }).first()).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'Payment' }).first()).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'Quantity' }).first()).toBeVisible();
    } else {
      // If no orders, verify the message
      await expect(page.getByText('No Orders Found')).toBeVisible();
    }
  });

  test('Admin should be able to view all orders', async ({ page }) => {
    // Login as admin
    await adminLogin(page);
    
    // Navigate to admin dashboard
    await page.goto('http://localhost:3000/dashboard/admin');
    
    // Click on "Orders" link
    await page.getByRole('link', { name: 'Orders' }).click();
    
    // Verify we're on the admin orders page
    await expect(page).toHaveURL(/dashboard\/admin\/orders/);
    
    // Verify admin orders page elements
    await expect(page.getByRole('heading', { name: 'All Orders' })).toBeVisible();
    
    // Check if orders table is visible or "No Orders Found" message
    const hasOrders = await page.getByText('No Orders Found').isHidden().catch(() => false);
    
    // In the 'Admin should be able to view all orders' test
    if (hasOrders) {
      // If there are orders, verify table headers
      await expect(page.getByRole('columnheader', { name: '#' }).first()).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'Status' }).first()).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'Buyer' }).first()).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'Date' }).first()).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'Payment' }).first()).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'Quantity' }).first()).toBeVisible();
    } else {
      // If no orders, verify the message
      await expect(page.getByText('No Orders Found')).toBeVisible();
    }
  });

  test('Admin should be able to update order status', async ({ page }) => {
    // Login as admin
    await adminLogin(page);
    
    // Navigate to admin dashboard
    await page.goto('http://localhost:3000/dashboard/admin/orders');
    
    // Check if there are any orders
    const hasOrders = await page.getByText('No Orders Found').isHidden().catch(() => false);
    
    if (hasOrders) {      
      await page.getByText('Not Process').first().click();
      // Choose a new status
      let newStatus = 'Processing';
      
      // Choose a new status
      await page.getByTitle(newStatus).locator('div').click();
      
      // Wait for the status to update
      await page.waitForTimeout(2000);

      await expect(page.getByRole('main')).toContainText(newStatus);
    } else {
      test.skip('No orders found to test status update');
    }
  });

  test('Non-admin users should not access admin orders page', async ({ page }) => {
    // Login as regular user
    await userLogin(page);
    
    // Try to navigate to admin orders page
    await page.goto('http://localhost:3000/dashboard/admin/orders');
    
    // Verify user is redirected or access denied
    await expect(page).not.toHaveURL(/dashboard\/admin\/orders/);
  });
});