import productConnection from "../confiq/productConnection.js";
import { getScrapedProductModel } from "../models/ScrapedProduct.js";

const ScrapedProduct = getScrapedProductModel(await productConnection());
console.log("Connected to DB:", productConnection.name); 
console.log("ScrapedProduct model name:", ScrapedProduct.modelName);
// or productConnection.db.databaseName

function normalizeProductName(name) {
  const match = name.match(/^(.*?)\s(.*?)(\d{1,4}\s?(ml|l|g|kg))$/i);

  if (!match) {
    // fallback for names without size info
    return {
      brand: name.split(" ")[0] || "Unknown",
      productName: name,
      quantity: "1 unit"
    };
  }

  return {
    brand: match[1]?.trim() || "Unknown",
    productName: match[2]?.trim() || name,
    quantity: match[3]?.toLowerCase() || "1 unit"
  };
}


export const getGroupedProducts = async (req, res) => {
  try {
    const products = await ScrapedProduct.find();
    console.log(`Total scraped products fetched: ${products.length}`);

    const grouped = {};

    for (const product of products) {
      const { brand, productName, quantity } = normalizeProductName(product.name);
      const key = `${brand.toLowerCase()}|${productName.toLowerCase()}|${quantity}`;

      if (!grouped[key]) {
        grouped[key] = {
          key,
          brand,
          name: productName,
          quantity,
          category: product.category,
          prices: []
        };
      }

      grouped[key].prices.push({
        platform: product.source,
        price: product.price || 0,
        available: product.stock !== "Out of Stock",
        originalName: product.name,
        image: product.image,
        url: product.url,
        deliveryTime: "10 mins"
      });
    }

    const groupedList = Object.values(grouped);
    console.log(`Grouped product entries: ${groupedList.length}`);

    if (groupedList.length > 0) {
      console.log("Sample grouped entry:", groupedList[0]);
    }

    res.json(groupedList);
  } catch (err) {
    console.error("Error grouping products:", err);
    res.status(500).json({ error: "Failed to group products" });
  }
};
