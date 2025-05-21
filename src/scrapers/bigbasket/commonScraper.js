
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { v4 as uuidv4 } from "uuid";
import ScrapedProduct from "../../models/ScrapedProduct.js";

// puppeteer.use(StealthPlugin());

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-()]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");

const autoScroll = async (page, containerSelector) => {
  let sameCountRepeat = 0;
  const maxScrolls = 15;

  for (let i = 0; i < maxScrolls; i++) {
    const before = await page.$$eval(containerSelector + " > li", items => items.length);

    await page.evaluate((sel) => {
      const container = document.querySelector(sel);
      if (container) container.scrollBy(0, 1000);
    }, containerSelector);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const after = await page.$$eval(containerSelector + " > li", items => items.length);

    if (after === before) {
      sameCountRepeat++;
    } else {
      sameCountRepeat = 0;
    }

    if (sameCountRepeat >= 3) break;
  }
};

const simulateMouseMovement = async (page) => {
  await page.mouse.move(100, 100);
  await page.mouse.move(200, 200);
  await page.mouse.move(300, 100);
};

const scrapeBigBasketCategory = async (url, categoryName) => {
  console.log(`Scraping ${categoryName} from BigBasket...`);

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-infobars",
      "--window-size=1920,1080",
      "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    ],
    defaultViewport: null,
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  await simulateMouseMovement(page);

  const containerSelector = 'ul.grid';
  const productSelector = 'ul.grid > li';

  await page.waitForSelector(containerSelector, { timeout: 15000 });
  await autoScroll(page, containerSelector);

  const products = await page.$$eval(productSelector, (cards) =>
    cards
      .map((card) => {
        const name = card.querySelector("h3 div")?.textContent?.trim() || "";
        const priceText = card.querySelector('div[class*="Pricing"] span')?.textContent?.trim() || "";
        const price = parseFloat(priceText.replace(/[^0-9.]/g, "") || "0");
        const image = card.querySelector("img")?.src || "";
        const link = card.querySelector("a")?.href || "";

        const isOutOfStock = !card.textContent.includes("Add");

        const slugify = (text) =>
          text
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w\-()]+/g, "")
            .replace(/--+/g, "-")
            .replace(/^-+|-+$/g, "");

        return {
          name,
          price,
          image,
          stock: isOutOfStock ? "Out of Stock" : "In Stock",
          url: link,
        };
      })
      .filter((p) => p.name && p.price && p.image)
  );

  for (const prod of products) {
    await ScrapedProduct.updateOne(
      { name: prod.name, source: "BigBasket", category: categoryName },
      {
        ...prod,
        category: categoryName,
        source: "BigBasket",
        id: uuidv4(),
      },
      { upsert: true }
    );
  }

  console.log(`Scraped ${products.length} products from ${categoryName}`);
  await browser.close();
};

export default scrapeBigBasketCategory;
