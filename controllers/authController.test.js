import { expect, jest } from "@jest/globals";
import { registerController, updateProfileController, getOrdersController, getAllOrdersController, orderStatusController } from "./authController";
import userModel from "../models/userModel";
import orderModel from "../models/orderModel";
import { hashPassword } from "./../helpers/authHelper.js";

jest.mock("../models/userModel.js");
jest.mock("../models/orderModel.js");
jest.mock("./../helpers/authHelper.js");

describe("Register Controller Test", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      body: {
        name: "John Doe",
        email: "invalid-email",
        password: "password123",
        phone: "12344000",
        address: "123 Street",
        answer: "Football",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(), // Mock to return this for chaining
      json: jest.fn(),
    };
  });

  test("user model is not saved for invalid email", async () => {
    // specify mock functionality
    userModel.findOne = jest.fn().mockResolvedValue(null);
    userModel.prototype.save = jest.fn();

    await registerController(req, res);
    expect(userModel.prototype.save).not.toHaveBeenCalled();
  });
});

describe("Update Profile Controller Test", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      body: {
        name: "Updated Name",
        password: "newpassword123",
        phone: "9876543210",
        address: "456 New Street",
      },
      user: {
        _id: "user123",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };

    // Mock user data returned from findById
    userModel.findById = jest.fn().mockResolvedValue({
      name: "Original Name",
      password: "oldpassword",
      phone: "1234567890",
      address: "123 Old Street",
    });
  });

  test("should handle case when user is not found", async () => {
    // Mock findById to return null
    userModel.findById = jest.fn().mockResolvedValue(null);
    
    await updateProfileController(req, res);
    
    // Verify error response - updated to match actual implementation
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      message: "User not found in database",
    });
  });

  test("should return error for password less than 6 characters", async () => {
    // Set password to be less than 6 characters
    req.body.password = "12345";

    await updateProfileController(req, res);

    // Verify json was called with error message
    expect(res.json).toHaveBeenCalledWith({ 
      error: "Passsword is required and 6 character long" 
    });
    
    // Verify hashPassword was not called
    expect(hashPassword).not.toHaveBeenCalled();

    // Verify findByIdAndUpdate was not called
    expect(userModel.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  test("should update profile without password", async () => {
    // Remove password from request
    delete req.body.password;

    // Mock return user of findById
    const mockUpdatedUser = {
      name: "Original Name",
      password: "oldpassword",
      phone: "1234567890",
      address: "123 Old Street",
    };
    userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedUser);

    await updateProfileController(req, res);
    // Verify hashPassword was not called
    expect(hashPassword).not.toHaveBeenCalled();
    // Verify findByIdAndUpdate was called with correct parameters
    expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
      "user123",
      {
        name: "Updated Name",
        password: "oldpassword",
        phone: "9876543210",
        address: "456 New Street",
      },
      { new: true }
    );

    // Verify response was sent with success status
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser: mockUpdatedUser,
    });
  });

  test("should update user profile successfully", async () => {
    // Mock hashPassword function
    hashPassword.mockResolvedValue("hashed_new_password");
    
    // Mock findByIdAndUpdate function
    const mockUpdatedUser = {
      name: "Updated Name",
      password: "hashed_new_password",
      phone: "9876543210",
      address: "456 New Street",
    };
    userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedUser);

    await updateProfileController(req, res);

    // Verify hashPassword was called with the new password
    expect(hashPassword).toHaveBeenCalledWith("newpassword123");
    
    // Verify findByIdAndUpdate was called with correct parameters
    expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
      "user123",
      {
        name: "Updated Name",
        password: "hashed_new_password",
        phone: "9876543210",
        address: "456 New Street",
      },
      { new: true }
    );
    
    // Verify response was sent with success status
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser: mockUpdatedUser,
    });
  });

  test("should handle errors during profile update", async () => {
    // Mock findByIdAndUpdate to throw an error
    userModel.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error("Database error"));
    
    await updateProfileController(req, res);
    
    // Verify error response
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      message: "Error While Update profile",
      error: expect.any(Error),
    });
  });
});

describe("Get Orders Controller Test", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      user: {
        _id: "user123",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };
  });

  test("should return user orders successfully", async () => {
    // Mock order data
    const mockOrders = [
      { id: "order1", products: ["product1"], buyer: "user123" },
      { id: "order2", products: ["product2"], buyer: "user123" },
    ];
    
    // Setup the chain
    orderModel.find = jest.fn().mockImplementation(() => {
      return {
        populate: jest.fn().mockImplementation(() => {
          return {
            populate: jest.fn().mockResolvedValue(mockOrders)
          };
        })
      };
    });

    await getOrdersController(req, res);

    // Verify find was called with correct user ID
    expect(orderModel.find).toHaveBeenCalledWith({ buyer: "user123" });
    
    // Verify response
    expect(res.json).toHaveBeenCalledWith(mockOrders);
  });

  test("should handle errors when fetching orders", async () => {
    // Mock orderModel.find to throw an error
    orderModel.find = jest.fn().mockImplementation(() => {
      throw new Error("Database error");
    });

    await getOrdersController(req, res);

    // Verify error response
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      message: "Error While Geting Orders",
      error: expect.any(Error),
    });
  });
});

describe("Get All Orders Controller Test", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      user: {
        _id: "admin123",
        role: 1 // Admin role
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    orderModel.find = jest.fn().mockReturnThis();
    orderModel.populate = jest.fn().mockReturnThis();
    orderModel.populate.mockReturnThis();
    orderModel.sort = jest.fn().mockResolvedValue([
      {
        _id: "order1",
        products: [{ name: "Product 1" }],
        buyer: { name: "User 1" },
        status: "Processing"
      },
      {
        _id: "order2",
        products: [{ name: "Product 2" }],
        buyer: { name: "User 2" },
        status: "Completed"
      }
    ]);
  });

  test("should return orders sorted by createdAt in descending order", async () => {
    // Create mock orders with different createdAt timestamps
    const mockOrders = [
      {
        _id: "order1",
        products: [{ name: "Product 1" }],
        buyer: { name: "User 1" },
        status: "Processing",
        createdAt: "2023-01-01T00:00:00.000Z"
      },
      {
        _id: "order2",
        products: [{ name: "Product 2" }],
        buyer: { name: "User 2" },
        status: "Completed",
        createdAt: "2023-02-01T00:00:00.000Z"
      },
      {
        _id: "order3",
        products: [{ name: "Product 3" }],
        buyer: { name: "User 3" },
        status: "Shipped",
        createdAt: "2023-03-01T00:00:00.000Z"
      }
    ];
    
    // Mock the sort function to return orders in the expected order (newest first)
    orderModel.sort = jest.fn().mockResolvedValue([
      mockOrders[2], // March (newest)
      mockOrders[1], // February
      mockOrders[0]  // January (oldest)
    ]);
    
    await getAllOrdersController(req, res);
    
    // Verify sort was called with createdAt: -1 (descending order)
    expect(orderModel.sort).toHaveBeenCalledWith({ createdAt: -1 });
    
    // Verify the response contains the sorted orders
    expect(res.json).toHaveBeenCalled();
    const responseData = res.json.mock.calls[0][0];
    
    // Verify the order of items in the response
    expect(responseData[0].createdAt).toBe("2023-03-01T00:00:00.000Z");
    expect(responseData[1].createdAt).toBe("2023-02-01T00:00:00.000Z");
    expect(responseData[2].createdAt).toBe("2023-01-01T00:00:00.000Z");
  });

  test("should handle errors properly", async () => {
    const error = new Error("Database error");
    orderModel.find.mockImplementation(() => {
      throw error;
    });
    
    await getAllOrdersController(req, res);
    
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      message: "Error While Getting Orders",
      error
    });
  });
});

describe("Order Status Controller Test", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      params: {
        orderId: "order123",
      },
      body: {
        status: "Processing",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };
  });

  test("should handle missing orderId", async () => {
    // Remove orderId from request
    req.params = {};
    
    await orderStatusController(req, res);
    
    // Verify error response - updated to match actual implementation
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      message: "Order ID is required"
    });
  });
  
  test("should handle missing status", async () => {
    // Remove status from request
    req.body = {};
    
    await orderStatusController(req, res);
    
    // Verify error response
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      message: "Status is required"
    });
  });

  test("should validate status against allowed values", async () => {
    // Set an invalid status
    req.body.status = "Completed"; // Not in the enum list
    
    await orderStatusController(req, res);
    
    // Verify validation error response
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      message: expect.stringContaining("Invalid status")
    });
    
    // Verify findByIdAndUpdate was NOT called due to validation failure
    expect(orderModel.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  test("should handle case when order is not found", async () => {
    // Mock findById to return null
    orderModel.findById = jest.fn().mockResolvedValue(null);

    await orderStatusController(req, res);

    // Verify error response
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      message: "Order not found"
    });
  });

  test("should update order status successfully", async () => {
    // Mock order data for findById
    const mockExistingOrder = {
      _id: "order123",
      status: "Not Process",
    };
    
    // Mock updated order data
    const mockUpdatedOrder = {
      _id: "order123",
      status: "Processing",
      products: ["product1"],
      buyer: "user1",
    };
    
    // Mock findById and findByIdAndUpdate functions
    orderModel.findById = jest.fn().mockResolvedValue(mockExistingOrder);
    orderModel.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedOrder);

    await orderStatusController(req, res);

    // Verify findById was called to check if order exists
    expect(orderModel.findById).toHaveBeenCalledWith("order123");
    
    // Verify findByIdAndUpdate was called with correct parameters
    expect(orderModel.findByIdAndUpdate).toHaveBeenCalledWith(
      "order123",
      { status: "Processing" },
      { new: true }
    );
    
    // Verify response
    expect(res.json).toHaveBeenCalledWith(mockUpdatedOrder);
  });

  test("should handle errors when updating order status", async () => {
    // Mock findById to return an order
    orderModel.findById = jest.fn().mockResolvedValue({ _id: "order123" });
    
    // Mock findByIdAndUpdate to throw an error
    orderModel.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error("Database error"));

    await orderStatusController(req, res);

    // Verify error response
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      message: "Error While Updateing Order",
      error: expect.any(Error),
    });
  });
});