import express from "express";
import getScrapedProductModel from "../models/ScrapedProduct.js";

const router = express.Router();
const ScrapedProduct = getScrapedProductModel();

router.get("/", async (req, res) => {
  try {
    // ✅ Add CORS headers manually
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

    const products = await ScrapedProduct.find();
    console.log(`🔍 Fetched ${products.length} scraped products`);
    res.json(products);
  } catch (err) {
    console.error("Failed to fetch scraped products:", err);
    res.status(500).json({ error: "Failed to fetch scraped products" });
  }
});

// Optional OPTIONS preflight handler
router.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.sendStatus(200);
});

export default router;
