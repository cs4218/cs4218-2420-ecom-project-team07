import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Order from './orderModel.js';

let mongoServer;

// Setup the in-memory database before tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

// Clean up after tests
afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

// Clear the database between tests
afterEach(async () => {
    if (mongoose.connection.readyState !== 0) {
        await Order.deleteMany({});
    }
});

describe('Order Model Tests', () => {
  // Test data
  const mockBuyerId = new mongoose.Types.ObjectId();
  const mockProductId = new mongoose.Types.ObjectId();
  
  const createValidOrderData = () => ({
    products: [mockProductId],
    payment: {
      success: true, 
      message: "Payment Success", 
      params: { 
        transaction: {
          amount: "100",
          paymentMethodNonce: "nonce123",
          options: {
            submitForSettlement: true
          },
          type: "credit_card"
        }
      },
      errors: null 
    },
    buyer: mockBuyerId,
    status: 'Processing'
  });

  // Test creating an order with missing required fields
  test('should not create an order with missing required fields', async () => {
    const orderData = {};
    const order = new Order(orderData);
    // Expect validation error when saving
    await expect(order.save()).rejects.toThrow();
  });

  test('should not create an order with missing products', async () => {
    const orderData = createValidOrderData();
    delete orderData.products;

    const order = new Order(orderData);
    // Expect validation error when saving
    await expect(order.save()).rejects.toThrow();
  });

  // Test creating an order with empty products array
  test('should not create an order with empty products array', async () => {
    const orderData = createValidOrderData();
    orderData.products = []; // Empty products array
    
    const order = new Order(orderData);
    // Expect validation error when saving
    await expect(order.save()).rejects.toThrow();
  });

  test('should not create an order with missing buyer', async () => {
    const orderData = createValidOrderData();
    delete orderData.buyer;
    
    const order = new Order(orderData);
    // Expect validation error when saving
    await expect(order.save()).rejects.toThrow();
  });

  test('should not create an order with missing payment', async () => {
    const orderData = createValidOrderData();
    delete orderData.payment;
    
    const order = new Order(orderData);
    // Expect validation error when saving
    await expect(order.save()).rejects.toThrow();
  });
  
  // Test creating an order with valid data
  test('should create a new order with valid data', async () => {
    const orderData = createValidOrderData();

    const order = new Order(orderData);
    const savedOrder = await order.save();

    // Verify the saved order
    expect(savedOrder._id).toBeDefined();
    expect(savedOrder.products[0].toString()).toBe(mockProductId.toString());
    expect(savedOrder.payment.success).toBe(true);
    expect(savedOrder.payment.message).toBe("Payment Success");
    expect(savedOrder.payment.params.transaction.amount).toBe("100");
    expect(savedOrder.payment.params.transaction.paymentMethodNonce).toBe("nonce123");
    expect(savedOrder.payment.params.transaction.options.submitForSettlement).toBe(true);
    expect(savedOrder.payment.params.transaction.type).toBe("credit_card");
    expect(savedOrder.payment.errors).toBe(null);
    expect(savedOrder.buyer.toString()).toBe(mockBuyerId.toString());
    expect(savedOrder.status).toBe('Processing');
    expect(savedOrder.createdAt).toBeDefined();
    expect(savedOrder.updatedAt).toBeDefined();
  });

  // Test status enum validation
  test('should validate status enum values', async () => {
    const orderData = createValidOrderData();
    orderData.status = 'Invalid Status'; // Invalid status value

    const order = new Order(orderData);
    
    // Expect validation error when saving
    await expect(order.save()).rejects.toThrow();
  });

  // Test creating an order with multiple products
  test('should create an order with multiple products', async () => {
    const mockProductId2 = new mongoose.Types.ObjectId();
    const orderData = createValidOrderData();
    orderData.products = [mockProductId, mockProductId2];

    const order = new Order(orderData);
    const savedOrder = await order.save();

    expect(savedOrder.products.length).toBe(2);
    expect(savedOrder.products[0].toString()).toBe(mockProductId.toString());
    expect(savedOrder.products[1].toString()).toBe(mockProductId2.toString());
  });

  // Test updating an order status
  test('should update order status', async () => {
    const orderData = createValidOrderData();
    orderData.status = 'Not Process';

    const order = new Order(orderData);
    const savedOrder = await order.save();

    // Update the status
    savedOrder.status = 'Shipped';
    const updatedOrder = await savedOrder.save();

    expect(updatedOrder.status).toBe('Shipped');
  });

  // Test timestamps functionality
  test('should have timestamps', async () => {
    const orderData = createValidOrderData();
    delete orderData.status; // 使用默认状态

    const order = new Order(orderData);
    const savedOrder = await order.save();

    expect(savedOrder.createdAt).toBeInstanceOf(Date);
    expect(savedOrder.updatedAt).toBeInstanceOf(Date);

    // Store the original updatedAt time
    const originalUpdatedAt = savedOrder.updatedAt;
    
    // Wait a moment and update to test updatedAt changes
    await new Promise(resolve => setTimeout(resolve, 100));
    savedOrder.status = 'Processing';
    const updatedOrder = await savedOrder.save();

    // Check that updatedAt has changed or is at least the same
    expect(updatedOrder.updatedAt).toBeDefined();
    expect(updatedOrder.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
  });

  // Test creating an order with minimal valid data
  test('should create an order with minimal valid data', async () => {
    const orderData = createValidOrderData();
    delete orderData.status; 

    const order = new Order(orderData);
    const savedOrder = await order.save();

    expect(savedOrder._id).toBeDefined();
    expect(savedOrder.products[0].toString()).toBe(mockProductId.toString());
    expect(savedOrder.payment.success).toBe(true);
    expect(savedOrder.payment.message).toBe("Payment Success");
    expect(savedOrder.payment.params.transaction.amount).toBe("100");
    expect(savedOrder.payment.params.transaction.paymentMethodNonce).toBe("nonce123");
    expect(savedOrder.payment.params.transaction.options.submitForSettlement).toBe(true);
    expect(savedOrder.payment.params.transaction.type).toBe("credit_card");
    expect(savedOrder.payment.errors).toBe(null);
    expect(savedOrder.buyer.toString()).toBe(mockBuyerId.toString());
    expect(savedOrder.status).toBe('Not Process');
    expect(savedOrder.createdAt).toBeDefined();
    expect(savedOrder.updatedAt).toBeDefined();
  });
});