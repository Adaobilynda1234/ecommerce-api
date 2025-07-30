const express = require("express");
const router = express.Router();
const Brand = require("../models/Brand");
const authMiddleware = require("../middleware/auth");

// GET /brands - Get all brands
router.get("/", async (req, res) => {
  try {
    const brands = await Brand.find().sort({ createdAt: -1 });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST /brands - Create a new brand (admin only)
router.post("/", authMiddleware(["admin"]), async (req, res) => {
  try {
    const { brandName } = req.body;

    if (!brandName) {
      return res.status(400).json({ message: "Brand name is required" });
    }

    // Check if brand already exists
    const existingBrand = await Brand.findOne({
      brandName: { $regex: new RegExp(`^${brandName}$`, "i") },
    });

    if (existingBrand) {
      return res.status(400).json({ message: "Brand already exists" });
    }

    const brand = new Brand({ brandName });
    await brand.save();

    res.status(201).json({
      message: "Brand created successfully",
      brand,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// PUT /brands/:id - Update a brand (admin only)
router.put("/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { brandName } = req.body;

    if (!brandName) {
      return res.status(400).json({ message: "Brand name is required" });
    }

    // Check if brand exists
    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    // Check if another brand with the same name exists
    const existingBrand = await Brand.findOne({
      brandName: { $regex: new RegExp(`^${brandName}$`, "i") },
      _id: { $ne: id },
    });

    if (existingBrand) {
      return res.status(400).json({ message: "Brand name already exists" });
    }

    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      { brandName },
      { new: true, runValidators: true }
    );

    res.json({
      message: "Brand updated successfully",
      brand: updatedBrand,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE /brands/:id - Delete a brand (admin only)
router.delete("/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    await Brand.findByIdAndDelete(id);

    res.json({
      message: "Brand deleted successfully",
      deletedBrand: brand,
    });
  } catch (error) {
    console.error("Error deleting brand:", error);
    res.status(500).json({ message: "Server error while deleting brand" });
  }
});

module.exports = router;
