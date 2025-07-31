const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

// productschema
const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    cost: { type: Number, required: true },
    productImages: [{ type: String }],
    description: { type: String, required: true },
    stockStatus: { type: String, required: true },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Add pagination plugin
productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Product", productSchema);
