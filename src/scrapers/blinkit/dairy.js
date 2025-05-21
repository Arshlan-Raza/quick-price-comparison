import scrapeBlinkitCategory from "./commonScraper.js";

const dairy = async () => {
  await scrapeBlinkitCategory("https://blinkit.com/cn/milk/cid/14/922", "Dairy & Milk");
  await scrapeBlinkitCategory("https://blinkit.com/cn/dairy-breakfast/bread-pav/cid/14/953", "Dairy & Milk");
  await scrapeBlinkitCategory("https://blinkit.com/cn/dairy-breakfast/eggs/cid/14/1200", "Dairy & Milk");
};

export default dairy;
