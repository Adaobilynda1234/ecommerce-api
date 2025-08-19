const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/auth");

// POST /orders - Create a new order (customers only)
router.post("/", authMiddleware(["customer"]), async (req, res) => {
  try {
    const { items } = req.body;

    // Validate that items array exists and is not empty
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Items array is required and cannot be empty",
      });
    }

    // Validate each item in the array
    const validatedItems = [];
    let totalOrderCost = 0;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const {
        productName,
        productId,
        ownerId,
        quantity,
        totalCost,
        shippingStatus,
      } = item;

      // Validate required fields
      if (
        !productName ||
        !productId ||
        !ownerId ||
        !quantity ||
        totalCost === undefined
      ) {
        return res.status(400).json({
          message: `Item at index ${i} is missing required fields: productName, productId, ownerId, quantity, totalCost`,
        });
      }

      // Validate data types
      if (typeof quantity !== "number" || quantity <= 0) {
        return res.status(400).json({
          message: `Item at index ${i}: quantity must be a positive number`,
        });
      }

      if (typeof totalCost !== "number" || totalCost < 0) {
        return res.status(400).json({
          message: `Item at index ${i}: totalCost must be a non-negative number`,
        });
      }

      // Validate shipping status if provided
      const validStatuses = ["pending", "shipped", "delivered"];
      if (shippingStatus && !validStatuses.includes(shippingStatus)) {
        return res.status(400).json({
          message: `Item at index ${i}: shippingStatus must be one of: ${validStatuses.join(
            ", "
          )}`,
        });
      }

      // Verify that the product exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          message: `Product with ID ${productId} not found`,
        });
      }

      validatedItems.push({
        productName,
        productId,
        ownerId,
        quantity,
        totalCost,
        shippingStatus: shippingStatus || "pending",
      });

      totalOrderCost += totalCost;
    }

    // Create the order
    const order = new Order({
      customerId: req.user.userId,
      items: validatedItems,
      totalOrderCost,
    });

    await order.save();

    // Populate the order with related data for the response
    await order.populate("customerId", "fullName email");
    await order.populate("items.productId", "productName cost");
    await order.populate("items.ownerId", "fullName");

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /orders - View all orders (admin only)
router.get("/", authMiddleware(["admin"]), async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customerId", "fullName email")
      .populate("items.productId", "productName cost")
      .populate("items.ownerId", "fullName")
      .sort({ createdAt: -1 });

    res.json({
      message: "Orders retrieved successfully",
      orders,
      count: orders.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /orders/:id - View a specific order (admin only)
router.get("/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("customerId", "fullName email")
      .populate("items.productId", "productName cost")
      .populate("items.ownerId", "fullName");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "Order retrieved successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// PATCH /orders/:id/status - Change order status (admin only)
router.patch("/:id/status", authMiddleware(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    // Validate order status
    const validOrderStatuses = [
      "pending",
      "processing",
      "completed",
      "cancelled",
    ];
    if (!orderStatus || !validOrderStatuses.includes(orderStatus)) {
      return res.status(400).json({
        message: `orderStatus must be one of: ${validOrderStatuses.join(", ")}`,
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = orderStatus;
    await order.save();

    // Populate for response
    await order.populate("customerId", "fullName email");
    await order.populate("items.productId", "productName cost");
    await order.populate("items.ownerId", "fullName");

    res.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// PATCH /orders/:orderId/items/:itemId/shipping-status - Change item shipping status (admin only)
router.patch(
  "/:orderId/items/:itemId/shipping-status",
  authMiddleware(["admin"]),
  async (req, res) => {
    try {
      const { orderId, itemId } = req.params;
      const { shippingStatus } = req.body;

      // Validate shipping status
      const validShippingStatuses = ["pending", "shipped", "delivered"];
      if (!shippingStatus || !validShippingStatuses.includes(shippingStatus)) {
        return res.status(400).json({
          message: `shippingStatus must be one of: ${validShippingStatuses.join(
            ", "
          )}`,
        });
      }

      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const item = order.items.id(itemId);
      if (!item) {
        return res.status(404).json({ message: "Item not found in order" });
      }

      item.shippingStatus = shippingStatus;
      await order.save();

      // Populate for response
      await order.populate("customerId", "fullName email");
      await order.populate("items.productId", "productName cost");
      await order.populate("items.ownerId", "fullName");

      res.json({
        message: "Item shipping status updated successfully",
        order,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

module.exports = router;
