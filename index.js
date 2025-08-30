const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const brandRoutes = require("./routes/brands");
const orderRoutes = require("./routes/orders");
const connectDB = require("./config/db");

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Configure this properly for production
    methods: ["GET", "POST"],
  },
});

app.use(express.json());

// Make io accessible to routes
app.set("io", io);

// Socket.io authentication middleware
const authenticateSocket = (socket, next) => {
  // Check for token in multiple locations
  let token = socket.handshake.auth.token; // Existing check
  if (!token) {
    // Check query parameters
    token = socket.handshake.query.token;
  }
  if (!token && socket.handshake.headers.authorization) {
    // Check headers (e.g., Authorization: Bearer <token>)
    token = socket.handshake.headers.authorization.replace("Bearer ", "");
  }

  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    socket.userRole = decoded.role;
    next();
  } catch (error) {
    next(new Error("Authentication error: Invalid token"));
  }
};

// Apply authentication middleware
io.use(authenticateSocket);

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log(`User ${socket.userId} connected`);

  // Join user to their own room for targeted notifications
  socket.join(`user_${socket.userId}`);

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`User ${socket.userId} disconnected`);
  });

  // Optional: Handle custom events
  // socket.on("join_room", (roomId) => {
  //   socket.join(roomId);
  //   console.log(`User ${socket.userId} joined room ${roomId}`);
  // });

  socket.on("join_room", (roomId) => {
    if (typeof roomId !== "string" || !roomId) {
      return socket.emit("error", { message: "Invalid roomId" });
    }
    socket.join(roomId);
    console.log(`User ${socket.userId} joined room ${roomId}`);
    socket.emit("room_joined", {
      roomId,
      message: `Successfully joined room ${roomId}`,
    });
  });
});

// Connect to MongoDB
connectDB();

// Routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/brands", brandRoutes);
app.use("/orders", orderRoutes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app, io };
