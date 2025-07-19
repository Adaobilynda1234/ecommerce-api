const mongoose = require("mongoose");

// productschema
const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cost: { type: Number, required: true },
  productImages: [{ type: String }],
  description: { type: String, required: true },
  stockStatus: { type: String, required: true },
});

module.exports = mongoose.model("Product", productSchema);
