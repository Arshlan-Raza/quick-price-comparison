// src/confiq/productConnection.js
import mongoose from "mongoose";

let productConnection;

export default function connectProductDB() {
  if (!productConnection) {
    productConnection = mongoose.createConnection(process.env.MONGO_URI_PRODUCT, {
      dbName: "dummy_price_checker",
    });

    productConnection.on("connected", () => {
      console.log("Scraped Product DB connected");
    });

    productConnection.on("error", (err) => {
      console.error("Scraped Product DB connection error:", err);
    });
  }

  return productConnection;
}
