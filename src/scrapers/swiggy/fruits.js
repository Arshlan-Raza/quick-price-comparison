import scrapeInstamartCategory from "./commonScraper.js";

const fruits = async () => {
  await scrapeInstamartCategory("https://www.swiggy.com/instamart/category-listing?categoryName=Fresh+Fruits&custom_back=true&filterName=&offset=0&showAgeConsent=false&storeId=1374258&taxonomyType=Speciality+taxonomy+1", "Fruits");
};

export default fruits;
