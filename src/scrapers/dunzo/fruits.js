import scrapeDunzoCategory from "./commonScraper.js";

const fruits = async () => {
  await scrapeDunzoCategory("https://Dunzo.com/cn/vegetables-fruits/fresh-fruits/cid/1487/1503", "Fruits");
};

export default fruits;
