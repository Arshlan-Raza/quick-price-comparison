import scrapeDunzoCategory from "./commonScraper.js";

const meat = async () => {
  await scrapeDunzoCategory( "https://Dunzo.com/cn/chicken-meat-fish/fresh-meat/cid/4/1201", "Meat");
};

export default meat;
