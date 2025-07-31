const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Brand = require("../models/Brand");
const authMiddleware = require("../middleware/auth");

// GET /products - Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("ownerId", "fullName")
      .populate("brand", "brandName");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /products/:brand/:page/:limit - Get paginated products by brand
router.get("/:brand/:page/:limit", async (req, res) => {
  try {
    const { brand, page, limit } = req.params;

    // Validate parameters
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({ message: "Invalid page number" });
    }

    if (isNaN(limitNum) || limitNum < 1 || limitNum > 10) {
      return res.status(400).json({
        message: "Invalid limit. Must be between 1 and 10",
      });
    }

    // Check if brand exists
    const brandExists = await Brand.findById(brand);
    if (!brandExists) {
      return res.status(404).json({ message: "Brand not found" });
    }

    const options = {
      page: pageNum,
      limit: limitNum,
      populate: [
        { path: "ownerId", select: "fullName" },
        { path: "brand", select: "brandName" },
      ],
      sort: { createdAt: -1 },
    };

    const products = await Product.paginate({ brand }, options);

    res.json({
      products: products.docs,
      totalProducts: products.totalDocs,
      totalPages: products.totalPages,
      currentPage: products.page,
      hasNextPage: products.hasNextPage,
      hasPrevPage: products.hasPrevPage,
      nextPage: products.nextPage,
      prevPage: products.prevPage,
      limit: products.limit,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST /products - Create a new product (admin only)
router.post("/", authMiddleware(["admin"]), async (req, res) => {
  try {
    const {
      productName,
      brand,
      cost,
      productImages,
      description,
      stockStatus,
    } = req.body;

    // Validate required fields
    if (!brand) {
      return res.status(400).json({ message: "Brand is required" });
    }

    // Check if brand exists
    const brandExists = await Brand.findById(brand);
    if (!brandExists) {
      return res.status(400).json({ message: "Invalid brand ID" });
    }

    const product = new Product({
      productName,
      ownerId: req.user.userId,
      brand,
      cost,
      productImages,
      description,
      stockStatus,
    });

    await product.save();

    // Populate the brand before sending response
    await product.populate("brand", "brandName");
    await product.populate("ownerId", "fullName");

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE /products/:id - Delete a product (admin only)
router.delete("/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.findByIdAndDelete(id);

    res.json({
      message: "Product deleted successfully",
      deletedProduct: product,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error while deleting product" });
  }
});

module.exports = router;
