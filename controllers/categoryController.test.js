import { expect, jest } from "@jest/globals";
import { createCategoryController, updateCategoryController, categoryController, singleCategoryController, deleteCategoryController } from "./categoryController.js";
import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

// Mock dependencies
jest.mock("../models/categoryModel.js");
jest.mock("slugify");

describe("createCategoryController Tests", () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return 400 when request body is missing", async () => {
    // Prepare mock request and response objects
    const req = {
        user: { role: 1 }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    // Call the controller function
    await createCategoryController(req, res);

    // Verify results
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ message: "Request body is required" });
  });

  test("should return 403 when user is missing", async () => {
    // Prepare mock request and response objects
    const req = {
      body: {}
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    // Call the controller function
    await createCategoryController(req, res);

    // Verify results   
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith({ 
        success: false,
        message: "Unauthorized: Admin access required" 
    });
  });

  test("should return 403 when user is not admin", async () => {
    // Prepare mock request and response objects
    const req = {
      body: {},
      user: { role: 0 }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    // Call the controller function
    await createCategoryController(req, res);

    // Verify results
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith({ 
        success: false,
        message: "Unauthorized: Admin access required" 
    });
  });

  test("should return 401 when name is not provided", async () => {
    // Prepare mock request and response objects
    const req = {
      body: {},
      user: { role: 1 }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    // Call the controller function
    await createCategoryController(req, res);

    // Verify results
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({ 
        success: false,
        message: "Name is required" 
    });
  });

  test("should return 200 when category already exists", async () => {
    // Prepare mock request and response objects
    const req = {
      body: { name: "Test Category" },
      user: { role: 1 }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    // Mock database query to return existing category
    categoryModel.findOne.mockResolvedValue({ name: "Test Category" });

    // Call the controller function
    await createCategoryController(req, res);

    // Verify results
    expect(categoryModel.findOne).toHaveBeenCalledWith({ name: "Test Category" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      success: true,
      message: "Category Already Exists"
    });
  });

  test("should create a new category and return 201", async () => {
    // Prepare mock request and response objects
    const req = {
      body: { name: "New Category" },
      user: { role: 1 }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    // Mock database query to return null (category doesn't exist)
    categoryModel.findOne.mockResolvedValue(null);
    
    // Mock slugify function
    slugify.mockReturnValue("new-category");
    
    // Mock saving new category
    const mockSave = jest.fn().mockResolvedValue({
      name: "New Category",
      slug: "new-category",
      _id: "mock-id"
    });
    
    categoryModel.mockImplementation(() => {
      return {
        save: mockSave
      };
    });

    // Call the controller function
    await createCategoryController(req, res);

    // Verify results
    expect(categoryModel.findOne).toHaveBeenCalledWith({ name: "New Category" });
    expect(slugify).toHaveBeenCalledWith("New Category");
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
      success: true,
      message: "New category created",
      category: {
        name: "New Category",
        slug: "new-category",
        _id: "mock-id"
      }
    });
  });

  test("should return 500 when an error occurs", async () => {
    // Prepare mock request and response objects
    const req = {
      body: { name: "Error Category" },
      user: { role: 1 }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    
    // Mock console log
    console.log = jest.fn();

    // Mock database query to throw error
    const mockError = new Error("Database error");
    categoryModel.findOne.mockRejectedValue(mockError);

    // Call the controller function
    await createCategoryController(req, res);

    // Verify results
    expect(console.log).toHaveBeenCalledWith(mockError);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      error: mockError,
      message: "Error in Category"
    });
  });
});

describe("updateCategoryController Tests", () => {
    // Reset all mocks before each test
    beforeEach(() => {
      jest.clearAllMocks();
      console.log = jest.fn(); // Mock console.log
    });
  
    test("should return 400 when request body is missing", async () => {
      // Prepare test data
      const req = {
        parms: {}, // Missing request body
        user: { role: 1 } // Mock admin user
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      // Call the controller function
      await updateCategoryController(req, res);

      // Verify results
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ 
        success: false,
        message: "Request body is required" 
      });
    });

    test("should return 400 when request parameter is missing", async () => {
      // Prepare test data
      const req = {
        body: { name: "Updated Category" }, // Missing request parameter
        user: { role: 1 } // Mock admin user
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      // Call the controller function
      await updateCategoryController(req, res);

      // Verify results
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ 
        success: false,
        message: "Request parameter is required" 
      });
    });

    test("should retrun 403 when user is missing", async () => {
      // Prepare test data
      const req = {
        body: { name: "Updated Category" },
        params: { id: "mock-category-id" }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      // Call the controller function  
      await updateCategoryController(req, res);

      // Verify results
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith({ 
        success: false,
        message: "Unauthorized: Admin access required"
      });
    });

    test("should return 403 when user is not admin", async () => {
      // Prepare test data
      const req = {
        body: { name: "Updated Category" },
        params: { id: "mock-category-id" },
        user: { role: 0 } // Mock non-admin user
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      // Call the controller function
      await updateCategoryController(req, res);

      // Verify results
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith({ 
        success: false,
        message: "Unauthorized: Admin access required" 
      });
    });

    test("should return 401 when name is not provided", async () => {
      // Prepare test data
      const req = {
        body: {}, // Missing name
        params: { id: "mock-category-id" },
        user: { role: 1 } // Mock admin user
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
      
      // Execute the function being tested
      await updateCategoryController(req, res);
      
      // Verify results
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: "Name is required"
      });
    });
    
    test("should return 401 when id is not provided", async () => {
      // Prepare test data
      const req = {
        body: { name: "Test Category" },
        params: {}, // Missing id
        user: { role: 1 } // Mock admin user
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
      
      // Execute the function being tested
      await updateCategoryController(req, res);
      
      // Verify results
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: "Category ID is required"
      });
    });
    
    test("should return 200 with error when category with same name exists", async () => {
      // Prepare test data
      const req = {
        body: { name: "Existing Category" },
        params: { id: "mock-category-id" },
        user: { role: 1 } // Mock admin user
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
      
      // Mock findOne to return an existing category
      categoryModel.findOne.mockResolvedValue({
        _id: "another-id",
        name: "Existing Category"
      });
      
      // Execute the function being tested
      await updateCategoryController(req, res);
      
      // Verify results
      expect(categoryModel.findOne).toHaveBeenCalledWith({
        name: "Existing Category",
        _id: { $ne: "mock-category-id" }
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: "Category with this name already exists"
      });
    });
    
    test("should return 404 when category is not found", async () => {
      // Prepare test data
      const req = {
        body: { name: "Non-existent Category" },
        params: { id: "non-existent-id" },
        user: { role: 1 } // Mock admin user
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
      
      // Mock findOne to return null (no duplicate)
      categoryModel.findOne.mockResolvedValue(null);
      
      // Mock slugify function
      slugify.mockReturnValue("non-existent-category");
      
      // Mock findByIdAndUpdate to return null (category not found)
      categoryModel.findByIdAndUpdate.mockResolvedValue(null);
      
      // Execute the function being tested
      await updateCategoryController(req, res);
      
      // Verify results
      expect(categoryModel.findByIdAndUpdate).toHaveBeenCalledWith(
        "non-existent-id",
        { name: "Non-existent Category", slug: "non-existent-category" },
        { new: true }
      );
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: "Category not found"
      });
    });
    
    test("should update category successfully", async () => {
      // Prepare test data
      const req = {
        body: { name: "Updated Category" },
        params: { id: "mock-category-id" },
        user: { role: 1 } // Mock admin user
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
      
      const mockCategory = {
        _id: "mock-category-id",
        name: "Updated Category",
        slug: "updated-category"
      };
      
      // Mock findOne to return null (no duplicate)
      categoryModel.findOne.mockResolvedValue(null);
      
      // Mock slugify function
      slugify.mockReturnValue("updated-category");
      
      // Mock findByIdAndUpdate method
      categoryModel.findByIdAndUpdate.mockResolvedValue(mockCategory);
      
      // Execute the function being tested
      await updateCategoryController(req, res);
      
      // Verify results
      expect(categoryModel.findByIdAndUpdate).toHaveBeenCalledWith(
        "mock-category-id",
        { name: "Updated Category", slug: "updated-category" },
        { new: true }
      );
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: "Category Updated Successfully",
        category: mockCategory
      });
    });

  test("should return 500 when an error occurs", async () => {
    // Prepare mock request and response objects
    const req = {
      body: { name: "Error Category" },
      params: { id: "mock-category-id" },
      user: { role: 1 } // Mock admin user
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    
    // Mock console log
    console.log = jest.fn();

    // Mock database query to throw error
    const mockError = new Error("Database error");
    categoryModel.findOne.mockRejectedValue(mockError);

    // Call the controller function
    await updateCategoryController(req, res);

    // Verify results
    expect(console.log).toHaveBeenCalledWith(mockError);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      error: mockError,
      message: "Error while updating category"
    });
  });
});

describe("Category Controller Tests", () => {
    // Reset mocks before each test
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("should return 403 when user is missing", async () => {
      // Prepare test data
      const req = {};

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      // Call the controller function
      await categoryController(req, res);

      // Verify results
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: "Unauthorized: Admin access required"
      });
    });
  
    test("should return 403 when user is not admin", async () => {
      // Prepare test data
      const req = { user: { role: 0 } }; // Mock non-admin user

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      // Call the controller function
      await categoryController(req, res);

      // Verify results
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: "Unauthorized: Admin access required"
      });
    });

    test("should get all categories successfully", async () => {
      // Prepare test data
      const mockCategories = [
        { _id: "1", name: "Electronics", slug: "electronics" },
        { _id: "2", name: "Clothing", slug: "clothing" }
      ];
      
      // Mock database query to return mock categories
      categoryModel.find.mockResolvedValue(mockCategories);
      
      // Mock request and response objects
      const req = {
        user: { role: 1 } // Mock admin user
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
      
      // Call the controller function
      await categoryController(req, res);
      
      // Verify results
      expect(categoryModel.find).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: "All Categories List",
        category: mockCategories
      });
    });
  
    test("should handle errors when getting categories", async () => {
      // Mock database query to throw error
      const mockError = new Error("Database error");
      categoryModel.find.mockRejectedValue(mockError);
      
      // Mock log function
      console.log = jest.fn();
      
      // Mock request and response objects
      const req = {
        user: { role: 1 } // Mock admin user
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
      
      // Call the controller function
      await categoryController(req, res);
      
      // Verify results
      expect(categoryModel.find).toHaveBeenCalledWith({});
      expect(console.log).toHaveBeenCalledWith(mockError);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        error: mockError,
        message: "Error while getting all categories"
      });
    });
  
    test("should return empty array when no categories exist", async () => {
      // Mock database query to return empty array
      categoryModel.find.mockResolvedValue([]);
      
      // Mock request and response objects
      const req = {
        user: { role: 1 } // Mock admin user
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
      
      // Call the controller function
      await categoryController(req, res);
      
      // Verify results
      expect(categoryModel.find).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: "All Categories List",
        category: []
      });
    });
});

describe('singleCategoryController Tests', () => {
    // Each test before reset all mocks
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    test('should return 400 when missing request parameter', async () => {
        // Mock request and response objects
        const req = {
          user: { role: 1 } // Mock admin user
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn()
        };
  
        // Call the controller function
        await singleCategoryController(req, res);
  
        // Verify results
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'Request parameter is required'
        });
      });

    test("should return 403 when user is missing", async () => {
      // Mock request and response objects
      const req = {
        params: { slug: "test-category"}
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      // Call the controller function
      await singleCategoryController(req, res);

      // Verify results
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: "Unauthorized: Admin access required",
      });
    });

    test("should return 403 when user is not admin", async () => {
      // Mock request and response objects
      const req = {
        user: { role: 0 }, // Mock non-admin user
        params: { slug: "test-category"}
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      // Call the controller function
      await singleCategoryController(req, res);

      // Verify results
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: "Unauthorized: Admin access required",
      });
    });

    test('should return 400 when missing slug parameter', async () => {
      // Mock request and response objects
      const req = {
        params: {},
        user: { role: 1 } // Mock admin user
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      // Call the controller function
      await singleCategoryController(req, res);

      // Verify results
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Slug parameter is required'
      });
    });

    test('should return 404 when category not found', async () => {
      // Mock database query to return null
      categoryModel.findOne.mockResolvedValue(null);

      // Mock request and response objects
      const req = {
        params: {
          slug: 'test-category'
        },
        user: { role: 1 } // Mock admin user
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      // Call the controller function
      await singleCategoryController(req, res);

      // Verify results
      expect(categoryModel.findOne).toHaveBeenCalledWith({ slug: 'test-category' });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Category not found'
      });
    });

    test('should successfully get a single category', async () => {
      // Mock request and response objects
      const req = {
        params: {
          slug: 'test-category'
        },
        user: { role: 1 } // Mock admin user
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
      
      // MockcategoryModel.findOne return a category
      const mockCategory = { _id: '123', name: 'Test Category', slug: 'test-category' };
      categoryModel.findOne.mockResolvedValue(mockCategory);
      
      // Call the controller function
      await singleCategoryController(req, res);
      
      // Verify results
      expect(categoryModel.findOne).toHaveBeenCalledWith({ slug: 'test-category' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: "Get Single Category Successfully",
        category: mockCategory
      });
    });
    
    test('should handle errors', async () => {
      // Mock request and response objects
      const req = {
        params: {
          slug: 'test-category'
        },
        user: { role: 1 } // Mock admin user
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
      
      // Mockconsole.log
      console.log = jest.fn();
      
      // MockcategoryModel.findOne throw an error
      const mockError = new Error('Database error');
      categoryModel.findOne.mockRejectedValue(mockError);
      
      // Call the controller function
      await singleCategoryController(req, res);
      
      // Verify results
      expect(categoryModel.findOne).toHaveBeenCalledWith({ slug: 'test-category' });
      expect(console.log).toHaveBeenCalledWith(mockError);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        error: mockError,
        message: "Error while getting Single Category"
      });
    });
});

describe('deleteCategoryController Tests', () => {
    // Each test before reset all mocks
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    test("should return 403 when user is missing", async () => {
      // Mock request and response objects
      const req = {
        params: {
          slug: 'test-category'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      // Call the controller function
      await deleteCategoryController(req, res);

      // Verify results
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Unauthorized: Admin access required'
      });
    });

    test("should return 403 when user is not admin", async () => {
      // Mock request and response objects
      const req = {
        params: {
          slug: 'test-category'
        },
        user: { role: 0 } // Mock non-admin user
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      // Call the controller function
      await deleteCategoryController(req, res);

      // Verify results
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Unauthorized: Admin access required'
      });
    });

    test('should return 400 when missing request parameter', async () => {
      // Mock request and response objects
      const req = {
        user: { role: 1 } // Mock admin user
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      // Call the controller function
      await deleteCategoryController(req, res);

      // Verify results
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Request parameter is required'
      });
    });

    test('should return 400 when missing category id', async () => {
      // Mock request and response objects
      const req = {
        params: {},
        user: { role: 1 } // Mock admin user
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      // Call the controller function
      await deleteCategoryController(req, res);

      // Verify results
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Category ID is required'
      });
    });

    test('should return 404 when category not found', async () => {
      // Mock request and response objects
      const req = {
        params: { id: '123456789012' },
        user: { role: 1 } // Mock admin user
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      // MockcategoryModel.findByIdAndDelete return null
      categoryModel.findByIdAndDelete.mockResolvedValue(null);

      // Call the controller function
      await deleteCategoryController(req, res);

      // Verify results
      expect(categoryModel.findByIdAndDelete).toHaveBeenCalledWith('123456789012');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Category not found or already deleted'
      });
    });

    test('should delete category successfully', async () => {
      // Mock request and response objects
      const req = {
        params: { id: '123456789012' },
        user: { role: 1 } // Mock admin user
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
  
      // MockcategoryModel.findByIdAndDelete success return
      categoryModel.findByIdAndDelete.mockResolvedValue({});
  
      // Call the controller function
      await deleteCategoryController(req, res);
  
      // Verify model method be called correctly
      expect(categoryModel.findByIdAndDelete).toHaveBeenCalledWith('123456789012');
      
      // Verify response status and content
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: "Category Deleted Successfully",
      });
    });
  
    test('should handle errors when deleting category', async () => {
      // Mock request and response objects
      const req = {
        params: { id: '123456789012' },
        user: { role: 1 } // Mock admin user
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
  
      // Mockconsole.log
      console.log = jest.fn();
  
      // MockcategoryModel.findByIdAndDelete throw an error
      const mockError = new Error('Database error');
      categoryModel.findByIdAndDelete.mockRejectedValue(mockError);
  
      // Call the controller function
      await deleteCategoryController(req, res);
  
      // Verify error be recorded
      expect(console.log).toHaveBeenCalledWith(mockError);
      
      // Verify response status and content
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: "Error while deleting category",
        error: mockError,
      });
    });
});