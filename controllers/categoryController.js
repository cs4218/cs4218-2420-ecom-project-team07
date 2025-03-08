import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

// Helper function to verify admin role
const isAdmin = (req) => {
  // Check if user exists and has admin role
  return req.user && req.user.role === 1;
};

export const createCategoryController = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send({ message: "Request body is required" });
    }

    // Verify admin authorization
    if (!isAdmin(req)) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized: Admin access required"
      });
    }

    const { name } = req.body;
    
    if (!name) {
      return res.status(401).send({ 
        success: false,
        message: "Name is required" 
      });
    }
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: true,
        message: "Category Already Exists",
      });
    }
    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "New category created",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Category",
    });
  }
};

//update category
export const updateCategoryController = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send({ 
        success: false,
        message: "Request body is required" 
      });
    }

    if (!req.params) {
      return res.status(400).send({ 
        success: false,
        message: "Request parameter is required" 
      });
    }

    // Verify admin authorization
    if (!isAdmin(req)) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized: Admin access required"
      });
    }

    const { name } = req.body;
    const { id } = req.params;
    
    if (!name) {
      return res.status(401).send({ 
        success: false,
        message: "Name is required" 
      });
    }
    
    if (!id) {
      return res.status(401).send({ 
        success: false,
        message: "Category ID is required" 
      });
    }
    
    // check if category with this name already exists
    const existingCategory = await categoryModel.findOne({ name, _id: { $ne: id } });
    if (existingCategory) {
      return res.status(200).send({
        success: false,
        message: "Category with this name already exists",
      });
    }
    
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }
    
    res.status(200).send({
      success: true,
      message: "Category Updated Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating category",
    });
  }
};

// get all categories
export const categoryController = async (req, res) => {
  try {
    // Verify admin authorization
    if (!isAdmin(req)) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized: Admin access required"
      });
    }

    const category = await categoryModel.find({});
    res.status(200).send({
      success: true,
      message: "All Categories List",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all categories",
    });
  }
};

// single category
export const singleCategoryController = async (req, res) => {
  try {
    if (!req.params) {
      return res.status(400).send({
        success: false,
        message: "Request parameter is required",
      });
    }

    // Verify admin authorization
    if (!isAdmin(req)) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized: Admin access required"
      });
    }

    const { slug } = req.params;
    
    if (!slug) {
      return res.status(401).send({
        success: false,
        message: "Slug parameter is required",
      });
    }
    
    const category = await categoryModel.findOne({ slug });
    
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }
    
    res.status(200).send({
      success: true,
      message: "Get Single Category Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting Single Category",
    });
  }
};

//delete category
export const deleteCategoryController = async (req, res) => {
  try {
    if (!req.params) {
      return res.status(400).send({
        success: false,
        message: "Request parameter is required",
      });
    }

    // Verify admin authorization
    if (!isAdmin(req)) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized: Admin access required"
      });
    }

    const { id } = req.params;
    
    if (!id) {
      return res.status(401).send({
        success: false,
        message: "Category ID is required",
      });
    }
    
    const deletedCategory = await categoryModel.findByIdAndDelete(id);
    
    if (!deletedCategory) {
      return res.status(404).send({
        success: false,
        message: "Category not found or already deleted",
      });
    }
    
    res.status(200).send({
      success: true,
      message: "Category Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting category",
      error,
    });
  }
};