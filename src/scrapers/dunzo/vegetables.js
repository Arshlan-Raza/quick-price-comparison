import scrapeDunzoCategory from "./commonScraper.js";

const vegetables = async () => {
  await scrapeDunzoCategory("https://Dunzo.com/cn/fresh-vegetables/cid/1487/1489", "Vegetables");
};

export default vegetables;
