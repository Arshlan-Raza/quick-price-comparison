import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { v4 as uuidv4 } from "uuid";
import ScrapedProduct from "../../models/ScrapedProduct.js";

puppeteer.use(StealthPlugin());

const slugify = (text) =>
  text.toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-()]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");

const autoScroll = async (page, containerSelector) => {
  let sameCountRepeat = 0;
  const maxScrolls = 15;

  for (let i = 0; i < maxScrolls; i++) {
    const before = await page.$$eval(`${containerSelector} a`, items => items.length);

    await page.evaluate((sel) => {
      const container = document.querySelector(sel);
      if (container) container.scrollBy(0, 1000);
    }, containerSelector);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    const after = await page.$$eval(`${containerSelector} a`, items => items.length);

    if (after === before) sameCountRepeat++;
    else sameCountRepeat = 0;

    if (sameCountRepeat >= 3) break;
  }
};

const waitForImages = async (page) => {
  await page.evaluate(() => {
    return new Promise((resolve) => {
      const imgs = Array.from(document.images);
      let loaded = 0;
      for (const img of imgs) {
        if (img.complete) {
          loaded++;
          continue;
        }
        img.addEventListener("load", () => {
          loaded++;
          if (loaded === imgs.length) resolve();
        });
        img.addEventListener("error", () => {
          loaded++;
          if (loaded === imgs.length) resolve();
        });
      }
      if (loaded === imgs.length) resolve();
    });
  });
};

const scrapeZeptoCategory = async (url, categoryName) => {
  console.log(`Scraping ${categoryName} from Zepto...`);

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--disable-infobars",
      "--window-size=1920,1080",
      "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
    ],
    defaultViewport: null,
  });

  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    await page.mouse.move(100 + Math.random() * 50, 100 + Math.random() * 50);
    await page.mouse.move(200 + Math.random() * 50, 300 + Math.random() * 50);
    await new Promise(res => setTimeout(res, 800 + Math.random() * 600)); 

    const containerSelector = 'div.grid';
    const productSelector = 'a[data-testid="product-card"]';

    await page.waitForSelector(productSelector, { timeout: 15000 });
    await autoScroll(page, containerSelector);
    await waitForImages(page);

    const products = await page.$$eval(productSelector, (cards) =>
      cards.map((card) => {
        const name = card.querySelector('[data-testid="product-card-name"]')?.textContent.trim() || "";
        const priceText = card.querySelector('[data-testid="product-card-price"]')?.textContent.trim() || "";
        const price = parseFloat(priceText.replace(/[^0-9.]/g, "") || "0");
        const image = card.querySelector('[data-testid="product-card-image"]')?.src || "";
        const href = card.getAttribute("href") || "";
        const idMatch = href.match(/pvid\/([a-z0-9\-]+)/i);
        const id = idMatch ? idMatch[1] : "";

        const isOutOfStock = price === 0 || !card.textContent.toLowerCase().includes("add");

        return {
          name,
          price,
          image,
          stock: isOutOfStock ? "Out of Stock" : "In Stock",
          url: `https://www.zepto.com${href}`
        };
      }).filter(p => p.name && p.price && p.image)
    );

    for (const prod of products) {
      await ScrapedProduct.updateOne(
        { name: prod.name, source: "Zepto", category: categoryName },
        {
          ...prod,
          category: categoryName,
          source: "Zepto",
          id: uuidv4(),
        },
        { upsert: true }
      );
    }

    console.log(`Scraped ${products.length} products from ${categoryName}`);
  } catch (error) {
    console.error(`Error scraping ${categoryName}: ${error.message}`);
  } finally {
    await browser.close();
  }
};

export default scrapeZeptoCategory;
