require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const http = require("http");
const setupHelmet = require("./middlewares/helmetMiddleware");

const app = express();

// Load configuration from environment variables
const PORT = process.env.PORT || 3000;

// Setup Helmet
setupHelmet(app);
app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    // origin: "http://192.168.100.2:5173", // testing local
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Create an HTTP server
const server = http.createServer(app);

// Routes import
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const baseRoutes = require("./routes/baseRoutes");
const detectRoutes = require("./routes/detectRoutes");
const plantRoutes = require("./routes/plantRoutes");

// const { createDefaultUser } = require("./controllers/authController");
// const { initializeDefaults } = require("./controllers/baseController");

// Your routes...
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => {
    console.log("Connected to MongoDB");

    // Initialize default user and other defaults
    // createDefaultUser();
    // initializeDefaults();
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    console.error(error.stack);
  });

app.get("/api", (req, res) => {
  res.send("Server is running");
});

// RESTful API routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/base", baseRoutes);
app.use("/api/detect", detectRoutes);
app.use("/api/plants", plantRoutes);


// Start the server with Socket.IO
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
