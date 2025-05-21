import scrapeBigBasketCategory from "./commonScraper.js";

const fruits = async () => {
  await scrapeBigBasketCategory("https://www.bigbasket.com/pc/fruits-vegetables/fresh-fruits/?nc=nb", "Fruits");
};

export default fruits;
