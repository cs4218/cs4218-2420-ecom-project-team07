import mongoose from 'mongoose';
import request from 'supertest';
import categoryModel from '../models/categoryModel.js';
import dotenv from 'dotenv';
import { app } from '../server.js';

// Load environment variables
dotenv.config();

// Store test category IDs for cleanup
const testCategoryIds = [];

// Test user credentials
const adminCredentials = {
  email: 'cs4218@test.com',
  password: 'cs4218@test.com'
};

let adminToken;

// Connect to test database and get admin token before tests
beforeAll(async () => {
  // Check if connection already exists
  if (mongoose.connection.readyState === 0) {
    // Use dedicated test database
    await mongoose.connect(process.env.MONGO_TEST_URL || 'mongodb://localhost:27017/ecommerce');
  }

  // Login as admin user to get token
  const loginResponse = await request(app)
    .post('/api/v1/auth/login')
    .send(adminCredentials);

  adminToken = loginResponse.body.token;
});

// Cleanup after each test - only delete data created during tests
afterEach(async () => {
  // Only delete test categories
  for (const categoryId of testCategoryIds) {
    await categoryModel.findByIdAndDelete(categoryId);
  }
  testCategoryIds.length = 0;
});

// Disconnect from database after all tests
afterAll(async () => {
  // Close connection if we created one
  if (mongoose.connection.readyState !== 0 && process.env.NODE_ENV === 'test') {
    await mongoose.connection.close();
  }
});

describe('Category Controller Integration Tests', () => {
  // Test category creation
  describe('Create Category Controller', () => {
    test('should create a new category successfully', async () => {
      const categoryData = {
        name: `Test Category ${Date.now()}`
      };

      const response = await request(app)
        .post('/api/v1/category/create-category')
        .set('Authorization', adminToken)
        .send(categoryData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('New category created');
      expect(response.body.category).toHaveProperty('name', categoryData.name);
      expect(response.body.category).toHaveProperty('slug');
      
      // Verify category was saved to database
      const savedCategory = await categoryModel.findById(response.body.category._id);
      expect(savedCategory).not.toBeNull();
      expect(savedCategory.name).toBe(categoryData.name);

      // Add to cleanup list
      testCategoryIds.push(response.body.category._id);
    });

    test('should not create category without name', async () => {
      const response = await request(app)
        .post('/api/v1/category/create-category')
        .set('Authorization', adminToken)
        .send({});

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Name is required');
    });

    test('should not create duplicate category', async () => {
      // First create a category
      const categoryData = {
        name: `Duplicate Test ${Date.now()}`
      };

      const createResponse = await request(app)
        .post('/api/v1/category/create-category')
        .set('Authorization', adminToken)
        .send(categoryData);
      
      testCategoryIds.push(createResponse.body.category._id);

      // Try to create category with same name
      const duplicateResponse = await request(app)
        .post('/api/v1/category/create-category')
        .set('Authorization', adminToken)
        .send(categoryData);

      expect(duplicateResponse.status).toBe(200);
      expect(duplicateResponse.body.success).toBe(true);
      expect(duplicateResponse.body.message).toBe('Category Already Exists');
    });
  });

  // Test category update
  describe('Update Category Controller', () => {
    test('should update category successfully', async () => {
      // First create a category
      const originalName = `Update Test ${Date.now()}`;
      const createResponse = await request(app)
        .post('/api/v1/category/create-category')
        .set('Authorization', adminToken)
        .send({ name: originalName });
      
      const categoryId = createResponse.body.category._id;
      testCategoryIds.push(categoryId);

      // Update the category
      const updatedName = `${originalName} Updated`;
      const updateResponse = await request(app)
        .put(`/api/v1/category/update-category/${categoryId}`)
        .set('Authorization', adminToken)
        .send({ name: updatedName });

      // Verify category was updated
      const updatedCategory = await categoryModel.findById(categoryId);
      expect(updatedCategory).not.toBeNull();
      expect(updatedCategory.name).toBe(updatedName);

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.success).toBe(true);
      expect(updateResponse.body.message).toBe('Category Updated Successfully');
      expect(updateResponse.body.category).toHaveProperty('name', updatedName);
    });

    test('should not update category with existing name', async () => {
      // Create two categories
      const name1 = `First Category ${Date.now()}`;
      const name2 = `Second Category ${Date.now()}`;
      
      const createResponse1 = await request(app)
        .post('/api/v1/category/create-category')
        .set('Authorization', adminToken)
        .send({ name: name1 });
      
      const createResponse2 = await request(app)
        .post('/api/v1/category/create-category')
        .set('Authorization', adminToken)
        .send({ name: name2 });
      
      const categoryId1 = createResponse1.body.category._id;
      const categoryId2 = createResponse2.body.category._id;
      
      testCategoryIds.push(categoryId1, categoryId2);

      // Try to update second category to have the same name as first category
      const updateResponse = await request(app)
        .put(`/api/v1/category/update-category/${categoryId2}`)
        .set('Authorization', adminToken)
        .send({ name: name1 });

      // Verify category was not updated and appropriate error message returned
      const updatedCategory = await categoryModel.findById(categoryId2);
      expect(updatedCategory).not.toBeNull();
      expect(updatedCategory.name).toBe(name2);

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.success).toBe(false);
      expect(updateResponse.body.message).toBe('Category with this name already exists');
    });

    test('should not update non-existent category', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const updateResponse = await request(app)
        .put(`/api/v1/category/update-category/${nonExistentId}`)
        .set('Authorization', adminToken)
        .send({ name: 'New Name' });

      expect(updateResponse.status).toBe(404);
      expect(updateResponse.body.success).toBe(false);
      expect(updateResponse.body.message).toBe('Category not found');
    });
  });

  // Test getting all categories
  describe('Get All Categories Controller', () => {
    test('should get all categories', async () => {
      // Create some test categories
      const category1 = await new categoryModel({
        name: `Test Category 1 ${Date.now()}`,
        slug: `test-category-1-${Date.now()}`
      }).save();
      
      const category2 = await new categoryModel({
        name: `Test Category 2 ${Date.now()}`,
        slug: `test-category-2-${Date.now()}`
      }).save();
      
      testCategoryIds.push(category1._id, category2._id);

      // Get all categories
      const response = await request(app)
        .get('/api/v1/category/get-category');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('All Categories List');
      expect(Array.isArray(response.body.category)).toBe(true);
      expect(response.body.category.length).toBeGreaterThanOrEqual(2);
    });
  });

  // Test getting a single category
  describe('Get Single Category Controller', () => {
    test('should get single category by slug', async () => {
      // Create test category
      const categoryName = `Single Test ${Date.now()}`;
      const category = await new categoryModel({
        name: categoryName,
        slug: `single-test-${Date.now()}`
      }).save();
      
      testCategoryIds.push(category._id);

      // Get single category
      const response = await request(app)
        .get(`/api/v1/category/single-category/${category.slug}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Get Single Category Successfully');
      expect(response.body.category).toHaveProperty('name', categoryName);
      expect(response.body.category).toHaveProperty('slug', category.slug);
    });

    test('should return 404 for non-existent category slug', async () => {
      const response = await request(app)
        .get('/api/v1/category/single-category/non-existent-slug');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Category not found');
    });
  });

  // Test deleting a category
  describe('Delete Category Controller', () => {
    test('should delete category successfully', async () => {
      // Create test category
      const category = await new categoryModel({
        name: `Delete Test ${Date.now()}`,
        slug: `delete-test-${Date.now()}`
      }).save();
      
      // Verify category exists
      const savedCategory = await categoryModel.findById(category._id);
      expect(savedCategory).not.toBeNull();
      expect(savedCategory.name).toBe(category.name);
      expect(savedCategory.slug).toBe(category.slug);

      // Delete category
      const response = await request(app)
        .delete(`/api/v1/category/delete-category/${category._id}`)
        .set('Authorization', adminToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Category Deleted Successfully');

      // Verify category was deleted
      const deletedCategory = await categoryModel.findById(category._id);
      expect(deletedCategory).toBeNull();
    });

    test('should return 404 for non-existent category id', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .delete(`/api/v1/category/delete-category/${nonExistentId}`)
        .set('Authorization', adminToken);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Category not found or already deleted');
    });
  });
});