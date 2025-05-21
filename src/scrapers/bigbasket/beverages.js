import scrapeBigBasketCategory from "./commonScraper.js";

const beverages = async () => {
  await scrapeBigBasketCategory("https://www.bigbasket.com/pc/beverages/energy-soft-drinks/cold-drinks/?nc=nb", "Beverages");
  await scrapeBigBasketCategory("https://www.bigbasket.com/pc/beverages/fruit-juices-drinks/juices/?nc=nb", "Beverages");
};

export default beverages;
