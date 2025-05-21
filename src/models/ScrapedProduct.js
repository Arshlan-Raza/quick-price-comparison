// src/models/ScrapedProduct.js
import mongoose from "mongoose";
import connectProductDB from "../confiq/productConnection.js";

const scrapedProductSchema = new mongoose.Schema({
  id: String,
  name: String,
  source: String,
  category: String,
  price: Number,
  stock: String,
  image: String,
  url: String
});

export default function getScrapedProductModel() {
  const conn = connectProductDB(); // <- make sure this returns the connection
  return conn.model("ScrapedProduct", scrapedProductSchema, "ScrapedProducts");
}
