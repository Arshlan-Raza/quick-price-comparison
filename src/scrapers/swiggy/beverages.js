import scrapeInstamartCategory from "./commonScraper.js";

const beverages = async () => {
  await scrapeInstamartCategory("https://www.swiggy.com/instamart/category-listing?categoryName=Cold+Drinks+and+Juices&custom_back=true&filterName=&offset=0&showAgeConsent=false&storeId=1374258&taxonomyType=Speciality+taxonomy+3", "Beverages");

};

export default beverages;
