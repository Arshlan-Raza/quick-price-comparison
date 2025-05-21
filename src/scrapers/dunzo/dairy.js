import scrapeDunzoCategory from "./commonScraper.js";

const dairy = async () => {
  await scrapeDunzoCategory("https://Dunzo.com/cn/milk/cid/14/922", "Dairy & Milk");
  await scrapeDunzoCategory("https://Dunzo.com/cn/dairy-breakfast/bread-pav/cid/14/953", "Dairy & Milk");
  await scrapeDunzoCategory("https://Dunzo.com/cn/dairy-breakfast/eggs/cid/14/1200", "Dairy & Milk");
};

export default dairy;
