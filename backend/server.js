const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const fileUpload = require("express-fileupload");
const cloudinary = require("./utils/cloudinary");
const errorHandler = require("./middleware/error");

// Load environment variables
dotenv.config();

// Route files
const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const messageRoutes = require("./routes/messageRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const leadRoutes = require("./routes/leadRoutes");

// Create Express app
const app = express();
const server = http.createServer(app);

// Set up CORS
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['*'],
  allowedHeaders: ['*']
}));

// Set up Socket.io
const io = socketio(server, {
  cors: {
    origin: [
      process.env.CLIENT_URL || "http://localhost:5173",
      "http://localhost:5174",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Join a room (for private messaging)
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  // Handle private message
  socket.on("privateMessage", (data) => {
    socket.to(data.receiverId).emit("newMessage", data);
  });

  // Handle typing indicator
  socket.on("typing", (data) => {
    socket.to(data.receiverId).emit("userTyping", data);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload middleware
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  })
);

// Set max file upload size in env
process.env.MAX_FILE_UPLOAD = 5 * 1024 * 1024; // 5MB

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/99acres-clone")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Mount routers
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/leads", leadRoutes);

// Base route
app.get("/", (req, res) => {
  res.send("99acres Clone API is running");
});

// Error handler middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
