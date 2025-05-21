import scrapeBlinkitCategory from "./commonScraper.js";

const vegetables = async () => {
  await scrapeBlinkitCategory("https://blinkit.com/cn/fresh-vegetables/cid/1487/1489", "Vegetables");
};

export default vegetables;
