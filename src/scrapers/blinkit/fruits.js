import scrapeBlinkitCategory from "./commonScraper.js";

const fruits = async () => {
  await scrapeBlinkitCategory("https://blinkit.com/cn/vegetables-fruits/fresh-fruits/cid/1487/1503", "Fruits");
};

export default fruits;
