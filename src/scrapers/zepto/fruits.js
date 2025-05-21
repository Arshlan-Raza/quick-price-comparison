import scrapeZeptoCategory from "./commonScraper.js";

const fruits = async () => {
  await scrapeZeptoCategory("https://www.zepto.com/cn/fruits-vegetables/fresh-fruits/cid/64374cfe-d06f-4a01-898e-c07c46462c36/scid/09e63c15-e5f7-4712-9ff8-513250b79942", "Fruits");
};

export default fruits;
