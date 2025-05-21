import scrapeBigBasketCategory from "./commonScraper.js";

const meat = async () => {
  await scrapeBigBasketCategory( "https://www.bigbasket.com/cl/eggs-meat-fish/?nc=nb", "Meat");
  await scrapeBigBasketCategory( "https://www.bigbasket.com/pc/eggs-meat-fish/poultry/fresh-chicken/?nc=nb", "Meat");
  await scrapeBigBasketCategory( "https://www.bigbasket.com/pc/eggs-meat-fish/fish-seafood/fresh-water-fish/?nc=nb", "Meat");
};

export default meat;
