import scrapeBigBasketCategory from "./commonScraper.js";

const dairy = async () => {
  await scrapeBigBasketCategory("https://www.bigbasket.com/pc/bakery-cakes-dairy/breads-buns/?nc=ct-fa", "Dairy & Milk");
  await scrapeBigBasketCategory("https://www.bigbasket.com/pc/bakery-cakes-dairy/dairy/fresh-milk/?nc=nb", "Dairy & Milk");
  await scrapeBigBasketCategory("https://www.bigbasket.com/pc/eggs-meat-fish/eggs/?nc=ct-fa", "Dairy & Milk");
};

export default dairy;
