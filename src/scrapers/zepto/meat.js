import scrapeZeptoCategory from "./commonScraper.js";

const meat = async () => {
  await scrapeZeptoCategory( "https://www.zepto.com/cn/meats-fish-eggs/top-picks/cid/4654bd8a-fb30-4ee1-ab30-4bf581b6c6e3/scid/b6fbf886-79f1-4a34-84bf-4aed50175418", "Meat");
};

export default meat;
