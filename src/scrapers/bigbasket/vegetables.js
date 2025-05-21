import scrapeBigBasketCategory from "./commonScraper.js";

const vegetables = async () => {
  await scrapeBigBasketCategory("https://www.bigbasket.com/pc/fruits-vegetables/fresh-vegetables/?nc=nb", "Vegetables");
};

export default vegetables;
