import scrapeZeptoCategory from "./commonScraper.js";

const vegetables = async () => {
  await scrapeZeptoCategory("https://www.zepto.com/cn/fruits-vegetables/fresh-vegetables/cid/64374cfe-d06f-4a01-898e-c07c46462c36/scid/b4827798-fcb6-4520-ba5b-0f2bd9bd7208", "Vegetables");
};

export default vegetables;
