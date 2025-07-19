const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const authMiddleware = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("ownerId", "fullName");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/", authMiddleware(["admin"]), async (req, res) => {
  try {
    const { productName, cost, productImages, description, stockStatus } =
      req.body;

    const product = new Product({
      productName,
      ownerId: req.user.userId,
      cost,
      productImages,
      description,
      stockStatus,
    });

    await product.save();
    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//  DELETE /products/:id - Delete a product (admin only)
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
