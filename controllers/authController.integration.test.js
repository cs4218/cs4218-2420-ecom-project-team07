import mongoose from 'mongoose';
import request from 'supertest';
import userModel from '../models/userModel.js';
import orderModel from '../models/orderModel.js';
import dotenv from 'dotenv';

// Import the app without starting the server
// Ensure the environment is set to test mode
process.env.NODE_ENV = 'test';
import { app } from '../server.js';

// Load environment variables
dotenv.config();

// Store IDs of created users and orders for cleanup
const testUserIds = [];
const testOrderIds = [];

// Link to the database before running tests
beforeAll(async () => {
  // Check if we are in test environment
  if (mongoose.connection.readyState === 0) {
    // Use test database
    await mongoose.connect(process.env.MONGO_TEST_URL || 'mongodb://localhost:27017/ecommerce');
  }
});

// Delete test users and orders after each test
afterEach(async () => {
  // Delete test users
  for (const userId of testUserIds) {
    await userModel.findByIdAndDelete(userId);
  }
  testUserIds.length = 0;
  
  // Delete test orders
  for (const orderId of testOrderIds) {
    await orderModel.findByIdAndDelete(orderId);
  }
  testOrderIds.length = 0;
});

// Close the database connection after all tests
afterAll(async () => {
  if (mongoose.connection.readyState !== 0 && process.env.NODE_ENV === 'test') {
    await mongoose.connection.close();
  }
});

describe('Auth Controller Integration Tests', () => {
  // Test user registration
  describe('Register Controller', () => {
    test('should register a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890',
        address: '123 Test Street',
        answer: 'Test Answer'
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User Register Successfully');
      expect(response.body.user).toHaveProperty('name', userData.name);
      expect(response.body.user).toHaveProperty('email', userData.email);
      
      // Verify user was saved to database
      const savedUser = await userModel.findOne({ email: userData.email });
      expect(savedUser).not.toBeNull();
      expect(savedUser.name).toBe(userData.name);
      
      // Add to cleanup list
      testUserIds.push(savedUser._id);
    });

    test('should not register user with existing email', async () => {
      // Create a user first
      const existingUser = new userModel({
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'hashedpassword',
        phone: '9876543210',
        address: '456 Existing Street',
        answer: 'Existing Answer'
      });
      const savedUser = await existingUser.save();
      testUserIds.push(savedUser._id);

      // Try to register with the same email
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'New User',
          email: 'existing@example.com',
          password: 'newpassword',
          phone: '1234567890',
          address: '123 New Street',
          answer: 'New Answer'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Already Register, please login');
    });
  });

  // Test user login
  describe('Login Controller', () => {
    test('should login user successfully', async () => {
      // Register a user first
      const registerResponse = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Login Test User',
          email: 'login@example.com',
          password: 'password123',
          phone: '1234567890',
          address: '123 Login Street',
          answer: 'Login Answer'
        });
      
      testUserIds.push(registerResponse.body.user._id);

      // Login with registered user credentials
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123'
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.success).toBe(true);
      expect(loginResponse.body.message).toBe('login successfully');
      expect(loginResponse.body.user).toHaveProperty('name', 'Login Test User');
      expect(loginResponse.body.token).toBeDefined();
    });

    test('should not login with incorrect password', async () => {
      // Register a user first
      const registerResponse = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Password Test User',
          email: 'password@example.com',
          password: 'correctpassword',
          phone: '1234567890',
          address: '123 Password Street',
          answer: 'Password Answer'
        });
      
      testUserIds.push(registerResponse.body.user._id);

      // Try to login with wrong password
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'password@example.com',
          password: 'wrongpassword'
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.success).toBe(false);
      expect(loginResponse.body.message).toBe('Invalid Password');
    });
  });

  // Test forgot password functionality
  describe('Forgot Password Controller', () => {
    test('should reset password successfully', async () => {
      // Register a user first
      const registerResponse = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Forgot Password User',
          email: 'forgot@example.com',
          password: 'oldpassword',
          phone: '1234567890',
          address: '123 Forgot Street',
          answer: 'Secret Answer'
        });
      
      testUserIds.push(registerResponse.body.user._id);

      // Reset password
      const resetResponse = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({
          email: 'forgot@example.com',
          answer: 'Secret Answer',
          newPassword: 'newpassword123'
        });

      expect(resetResponse.status).toBe(200);
      expect(resetResponse.body.success).toBe(true);
      expect(resetResponse.body.message).toBe('Password Reset Successfully');

      // Verify can login with new password
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'forgot@example.com',
          password: 'newpassword123'
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.success).toBe(true);
    });

    test('should not reset password with wrong answer', async () => {
      // Register a user first
      const registerResponse = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Wrong Answer User',
          email: 'wrong@example.com',
          password: 'oldpassword',
          phone: '1234567890',
          address: '123 Wrong Street',
          answer: 'Correct Answer'
        });
      
      testUserIds.push(registerResponse.body.user._id);

      // Try to reset password with wrong security answer
      const resetResponse = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({
          email: 'wrong@example.com',
          answer: 'Wrong Answer',
          newPassword: 'newpassword123'
        });

      expect(resetResponse.status).toBe(404);
      expect(resetResponse.body.success).toBe(false);
      expect(resetResponse.body.message).toBe('Wrong Email Or Answer');
    });
  });

  // Test update user profile
  describe('Update Profile Controller', () => {
    let token;
    let userId;

    beforeEach(async () => {
      // Register and login user to get token
      const registerResponse = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Profile User',
          email: 'profile@example.com',
          password: 'password123',
          phone: '1234567890',
          address: '123 Profile Street',
          answer: 'Profile Answer'
        });

      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'profile@example.com',
          password: 'password123'
        });

      token = loginResponse.body.token;
      userId = loginResponse.body.user._id;
      testUserIds.push(userId);
    });

    test('should update user profile successfully', async () => {
      const updateData = {
        name: 'Updated Profile User',
        password: 'newpassword123',
        phone: '9876543210',
        address: '456 Updated Street'
      };

      const response = await request(app)
        .put('/api/v1/auth/profile')
        .set('Authorization', token)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Profile Updated Successfully');
      expect(response.body.updatedUser).toHaveProperty('name', updateData.name);
      expect(response.body.updatedUser).toHaveProperty('phone', updateData.phone);
      expect(response.body.updatedUser).toHaveProperty('address', updateData.address);

      // Verify can login with new password
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'profile@example.com',
          password: 'newpassword123'
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.success).toBe(true);
    });
  });

  // Test order-related functionality
  describe('Order Controllers', () => {
    let userToken;
    let adminToken;
    let orderId;
    let userId;
    let adminId;
  
    beforeEach(async () => {
      const userLoginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'user@test.com',
          password: 'user@test.com'
        });
      userToken = userLoginResponse.body.token;
      userId = userLoginResponse.body.user._id; // Get the ID of the existing user
  
      // Login admin user
      const adminLoginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'cs4218@test.com',
          password: 'cs4218@test.com'
        });
      adminToken = adminLoginResponse.body.token;
      adminId = adminLoginResponse.body.user._id;
  
      // Fix order creation - Set the correct product array format
      const productId1 = new mongoose.Types.ObjectId('66db427fdb0119d9234b27f1');
      const productId2 = new mongoose.Types.ObjectId('66db427fdb0119d9234b27f5')
      const order = new orderModel({
        products: [productId1, productId2],
        payment: {},
        buyer: userId,
        status: 'Not Process'
      });
      
      const savedOrder = await order.save();
      orderId = savedOrder._id;
      testOrderIds.push(orderId);
    });

    test('user should get their orders', async () => {
      const response = await request(app)
        .get('/api/v1/auth/orders')
        .set('Authorization', userToken);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('admin should get all orders', async () => {
      const response = await request(app)
        .get('/api/v1/auth/all-orders')
        .set('Authorization', adminToken);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('admin should update order status', async () => {
      const response = await request(app)
        .put(`/api/v1/auth/order-status/${orderId}`)
        .set('Authorization', adminToken)
        .send({ status: 'Processing' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('status', 'Processing');
    });
  });
});