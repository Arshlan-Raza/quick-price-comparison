import scrapeDunzoCategory from "./commonScraper.js";

const beverages = async () => {
  await scrapeDunzoCategory("https://Dunzo.com/cn/cold-drinks-juices/soft-drinks/cid/332/1102", "Beverages");
  await scrapeDunzoCategory("https://Dunzo.com/cn/cold-drinks-juices/fruit-juices/cid/332/955", "Beverages");
};

export default beverages;
