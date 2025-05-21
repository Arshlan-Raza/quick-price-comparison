import puppeteer from "puppeteer";
import { v4 as uuidv4 } from "uuid";
import ScrapedProduct from "../../models/ScrapedProduct.js";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

// puppeteer.use(StealthPlugin());

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-()]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");

const autoScroll = async (page, itemSelector) => {
  let sameCountRepeat = 0;
  const maxScrolls = 15;

  for (let i = 0; i < maxScrolls; i++) {
    const before = await page.$$eval(itemSelector, items => items.length);

    await page.evaluate(() => {
      window.scrollBy(0, 1000);
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const after = await page.$$eval(itemSelector, items => items.length);

    if (after === before) {
      sameCountRepeat++;
    } else {
      sameCountRepeat = 0;
    }

    if (sameCountRepeat >= 3) break;
  }
};

const scrapeInstamartCategory = async (url, categoryName) => {
  console.log(`Scraping ${categoryName} from Instamart...`);

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--disable-infobars",
      "--window-size=1920,1080",
      "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    ],
    defaultViewport: null,
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  const itemSelector = "div[data-testid='ItemWidgetContainer']";

  await page.waitForSelector(itemSelector, { timeout: 15000 });
  await autoScroll(page, itemSelector);

const products = await page.$$eval(itemSelector, (cards) =>
  cards
    .map((card) => {
      const slugify = (text) =>
        text
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w\-()]+/g, "")
          .replace(/--+/g, "-")
          .replace(/^-+|-+$/g, "");

      const name = card.querySelector("div.novMV")?.textContent?.trim() || "";
      const priceText = card.querySelector("div[data-testid='item-offer-price']")?.textContent?.trim() || "";
      const price = parseFloat(priceText.replace(/[^0-9.]/g, "") || "0");
      const image = card.querySelector("img[data-testid='item-image-default']")?.src || "";

      const isOutOfStock = price === 0 || !card.innerText.includes("ADD");

      const slug = slugify(name);
      const url = slug ? `https://www.swiggy.com/instamart/item/${slug}` : "";

      return {
        name,
        price,
        image,
        stock: isOutOfStock ? "Out of Stock" : "In Stock",
        url,
      };
    })
    .filter((p) => p.name && p.price && p.image)
);


  for (const prod of products) {
    await ScrapedProduct.updateOne(
      { name: prod.name, source: "Instamart", category: categoryName },
      {
        ...prod,
        category: categoryName,
        source: "Instamart",
        id: uuidv4(),
      },
      { upsert: true }
    );
  }

  console.log(`Scraped ${products.length} products from ${categoryName}`);
  await browser.close();
};

export default scrapeInstamartCategory;
