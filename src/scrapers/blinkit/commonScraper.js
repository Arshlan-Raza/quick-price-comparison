import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { v4 as uuidv4 } from "uuid";
import ScrapedProduct from "../../models/ScrapedProduct.js";


puppeteer.use(StealthPlugin());

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-()]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");

const autoScroll = async (page, selector) => {
  let sameCountRepeat = 0;
  const maxScrolls = 15;

  for (let i = 0; i < maxScrolls; i++) {
    const before = await page.$$eval(selector, (items) => items.length);
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const after = await page.$$eval(selector, (items) => items.length);
    if (after === before) {
      sameCountRepeat++;
    } else {
      sameCountRepeat = 0;
    }

    if (sameCountRepeat >= 3) break;
  }
};

const scrapeBlinkitCategory = async (url, categoryName) => {
  console.log(`Scraping ${categoryName} from Blinkit...`);

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
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 60000, 
    });

  
    await page.mouse.move(200, 200);
    await page.mouse.click(200, 200, { delay: 100 });

    const productSelector = 'div[role="button"][class*="tw-relative"][class*="tw-flex"][class*="tw-h-full"]';
    await page.waitForSelector(productSelector, { timeout: 15000 });

    await autoScroll(page, productSelector);

  
    await page.evaluate(() => {
      return new Promise((resolve) => {
        const imgs = Array.from(document.images);
        let loaded = 0;
        for (let img of imgs) {
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

    const products = await page.$$eval(productSelector, (cards) =>
      cards
        .map((card) => {
          const name = card.querySelector("div.tw-text-300.tw-font-semibold")?.textContent?.trim() || "";
          const priceText = card.querySelector("div.tw-text-200.tw-font-semibold")?.textContent?.trim() || "";
          const price = parseFloat(priceText.replace(/[^0-9.]/g, "") || "0");
          const image = card.querySelector("div.tw-relative img")?.src || "";
          const id = card.getAttribute("id");

          const isOutOfStock =
            price === 0 || !card.querySelector("div[role='button']")?.textContent?.includes("ADD");

          const slugify = (text) =>
            text
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^\w\-()]+/g, "")
              .replace(/--+/g, "-")
              .replace(/^-+|-+$/g, "");

          const slug = slugify(name);
          const url = id && slug ? `https://blinkit.com/prn/${slug}/prid/${id}` : "";

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
        { name: prod.name, source: "Blinkit", category: categoryName },
        {
          ...prod,
          category: categoryName,
          source: "Blinkit",
          id: uuidv4(),
        },
        { upsert: true }
      );
    }

    console.log(`Scraped ${products.length} products from ${categoryName}`);
  } catch (err) {
    console.error(`Failed to scrape ${categoryName}:`, err.message);
  } finally {
    await browser.close();
  }
};

export default scrapeBlinkitCategory;
