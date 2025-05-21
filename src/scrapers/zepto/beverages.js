import scrapeZeptoCategory from "./commonScraper.js";

const beverages = async () => {
  await scrapeZeptoCategory("https://www.zepto.com/cn/cold-drinks-juices/soft-drinks/cid/947a72ae-b371-45cb-ad3a-778c05b64399/scid/dff3658b-c351-4e7f-8196-e98d0c66d99e", "Beverages");
  await scrapeZeptoCategory("https://www.zepto.com/cn/cold-drinks-juices/fruit-juices-drinks/cid/947a72ae-b371-45cb-ad3a-778c05b64399/scid/c41e2ad3-2dcc-42b6-829b-7e3a8e78d754", "Beverages");
};

export default beverages;
