const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const brandRoutes = require("./routes/brands");
const connectDB = require("./config/db");

dotenv.config();
const app = express();

app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/brands", brandRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
