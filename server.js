import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/confiq/db.js";
import checkAndUpdatePort from "./check-port.js";

// Load environment variables
dotenv.config();

const app = express();

//real time data api
import scrapedProductRoutes from "./src/routes/scrapedProduct.js";
app.use("/api/scrapedproduct", scrapedProductRoutes);

import groupedProductsRoute from "./src/routes/groupedProducts.js";
app.use("/api/grouped-products", groupedProductsRoute);



// Import routes
import productRoutes from "./src/routes/products.js";
import userRoutes from "./src/routes/users.js";
import cartRoutes from "./src/routes/cart.js";
import paymentRoutes from "./src/routes/payments.js";

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    'http://localhost:3001',
    'http://localhost:3002'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control'
  ]
};


// Apply CORS and middleware
app.use(cors(corsOptions));
app.use(express.json());

// Universal headers middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") return res.sendStatus(200);

  res.header('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.header('Expires', '0');
  res.header('Pragma', 'no-cache');
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - ${req.ip}`);
  next();
});

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Server error',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Boot server
async function startServer() {
  try {
    // Connect default MongoDB
    await connectDB();
    console.log("✅ Main MongoDB Connected");

    // Connect product MongoDB
    const { default: connectProductDB } = await import("./src/confiq/productConnection.js");
    await connectProductDB();
    console.log("✅ Scraped Product MongoDB Connected");

    const PORT = await checkAndUpdatePort() || process.env.PORT || 5000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`Products API: http://localhost:${PORT}/api/products`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
