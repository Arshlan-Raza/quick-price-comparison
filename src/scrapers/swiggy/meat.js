import scrapeInstamartCategory from "./commonScraper.js";

const meat = async () => {
  await scrapeInstamartCategory( "https://www.swiggy.com/instamart/category-listing?categoryName=Meat+and+Seafood&custom_back=true&filterName=&offset=0&showAgeConsent=false&storeId=1374258&taxonomyType=Speciality+taxonomy+1", "Meat");
};

export default meat;
