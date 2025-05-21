import puppeteer from "puppeteer";
import { v4 as uuidv4 } from "uuid";
import ScrapedProduct from "../../models/ScrapedProduct.js";

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
    const before = await page.$$eval(containerSelector + " > div", items => items.length);

    await page.evaluate((sel) => {
      const container = document.querySelector(sel);
      if (container) container.scrollBy(0, 1000);
    }, containerSelector);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const after = await page.$$eval(containerSelector + " > div", items => items.length);

    if (after === before) {
      sameCountRepeat++;
    } else {
      sameCountRepeat = 0;
    }

    if (sameCountRepeat >= 3) break;
  }
};

const scrapeDunzoCategory = async (url, categoryName) => {
  console.log(`Scraping ${categoryName} from Dunzo...`);

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

  const containerSelector = "#plpContainer";
  const productSelector = 'div[role="button"][class*="tw-relative"][class*="tw-flex"][class*="tw-h-full"]';

  await page.waitForSelector(containerSelector, { timeout: 10000 });
  await autoScroll(page, containerSelector);

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
        const url = id && slug ? `https://Dunzo.com/prn/${slug}/prid/${id}` : "";

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
      { name: prod.name, source: "Dunzo", category: categoryName },
      {
        ...prod,
        category: categoryName,
        source: "Dunzo",
        id: uuidv4(),
      },
      { upsert: true }
    );
  }

  console.log(`Scraped ${products.length} products from ${categoryName}`);
  await browser.close();
};

export default scrapeDunzoCategory;
