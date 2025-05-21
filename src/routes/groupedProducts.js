import express from "express";
import getScrapedProductModel from "../models/ScrapedProduct.js";

const router = express.Router();
const ScrapedProduct = getScrapedProductModel();

const platformMap = {
  instamart: "swiggy",
  blinkit: "blinkit",
  zepto: "zepto",
  bigbasket: "bigbasket",
  dunzo: "dunzo"
};

const ALL_PLATFORMS = [
  { id: "swiggy", deliveryTime: "15 mins" },
  { id: "blinkit", deliveryTime: "10 mins" },
  { id: "bigbasket", deliveryTime: "30 mins" },
  { id: "zepto", deliveryTime: "8 mins" },
  { id: "dunzo", deliveryTime: "20 mins" }
];

// Preflight CORS handler
router.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.sendStatus(200);
});

// Grouped product API with CORS
router.get("/", async (req, res) => {
  try {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

    const scrapedProducts = await ScrapedProduct.find();
    const groupedMap = new Map();

    for (const item of scrapedProducts) {
      const platformRaw = item.source?.toLowerCase() || "unknown";
      const platform = platformMap[platformRaw] || platformRaw;

      const key = `${item.name?.toLowerCase().trim()}|${item.stock || item.unit || "1 unit"}`;

      if (!groupedMap.has(key)) {
        groupedMap.set(key, {
          id: item.id || item._id.toString(),
          name: item.name,
          description: item.description || `Details about ${item.name}`,
          category: item.category || "General",
          image: item.image,
          unit: item.stock || "1 unit",
          prices: []
        });
      }

      const available = item.stock?.toLowerCase().includes("in stock");
      const deliveryTime = ALL_PLATFORMS.find(p => p.id === platform)?.deliveryTime || "20 mins";

      groupedMap.get(key).prices.push({
        platform,
        price: item.price || 0,
        available,
        deliveryTime
      });
    }

    // Fill missing platform prices with dummy data
    for (const product of groupedMap.values()) {
      const existingPlatforms = product.prices.map(p => p.platform);
      const basePrice = product.prices.find(p => p.available)?.price || 50;

      for (const plat of ALL_PLATFORMS) {
        if (!existingPlatforms.includes(plat.id)) {
          const generatedPrice = Math.round(basePrice * (0.9 + Math.random() * 0.2));
          const available = Math.random() < 0.4; // 40% chance to be available

          product.prices.push({
            platform: plat.id,
            price: generatedPrice,
            available,
            deliveryTime: plat.deliveryTime
          });
        }
      }

      // Sort prices by platform name
      product.prices.sort((a, b) => a.platform.localeCompare(b.platform));
    }

    res.json(Array.from(groupedMap.values()));
  } catch (error) {
    console.error("Failed to group scraped products:", error);
    res.status(500).json({ error: "Failed to group scraped products" });
  }
});

export default router;
