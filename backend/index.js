const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { sequelize } = require("./models");

const customerRoutes = require("./routes/customerRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Laundry API is running",
  });
});

// Health check route
app.get("/api/health", async (req, res) => {
  try {
    await sequelize.authenticate();

    res.json({
      status: "OK",
      app: "Laundry Management API",
      database: "Connected",
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      app: "Laundry Management API",
      database: "Not connected",
      error: error.message,
    });
  }
});

// Routes
app.use("/api/customers", customerRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reports", reportRoutes);

// Start server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

    await sequelize.sync();
    console.log("Database synced successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error.message);
  }
};

startServer();
