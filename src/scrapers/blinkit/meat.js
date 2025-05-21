import scrapeBlinkitCategory from "./commonScraper.js";

const meat = async () => {
  await scrapeBlinkitCategory( "https://blinkit.com/cn/chicken-meat-fish/fresh-meat/cid/4/1201", "Meat");
};

export default meat;
