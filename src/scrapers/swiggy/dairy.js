import scrapeInstamartCategory from "./commonScraper.js";

const dairy = async () => {
  await scrapeInstamartCategory("https://www.swiggy.com/instamart/category-listing?categoryName=Dairy%2C+Bread+and+Eggs&custom_back=true&filterName=&offset=0&showAgeConsent=false&storeId=1374258&taxonomyType=Speciality+taxonomy+1", "Dairy & Milk");

};

export default dairy;
