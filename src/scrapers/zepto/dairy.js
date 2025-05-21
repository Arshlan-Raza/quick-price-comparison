import scrapeZeptoCategory from "./commonScraper.js";

const dairy = async () => {
  await scrapeZeptoCategory("https://www.zepto.com/cn/dairy-bread-eggs/milk/cid/4b938e02-7bde-4479-bc0a-2b54cb6bd5f5/scid/22964a2b-0439-4236-9950-0d71b532b243", "Dairy & Milk");
  await scrapeZeptoCategory("https://www.zepto.com/cn/dairy-bread-eggs/breads-buns/cid/4b938e02-7bde-4479-bc0a-2b54cb6bd5f5/scid/30566884-bbd7-49fa-8c3f-43c90a571c9e", "Dairy & Milk");
  await scrapeZeptoCategory("https://www.zepto.com/cn/dairy-bread-eggs/eggs/cid/4b938e02-7bde-4479-bc0a-2b54cb6bd5f5/scid/d638f064-e7f3-4161-b692-a3f472c64020", "Dairy & Milk");
};

export default dairy;
