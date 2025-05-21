import dairy from "./dairy.js";
import fruits from "./fruits.js";
import vegetables from "./vegetables.js";
import meat from "./meat.js";
import beverages from "./beverages.js";
import ScrapedProduct from "../../models/ScrapedProduct.js";

const scrapeAllInstamart = async () => {
  // console.log(" Clearing old Instamart data...");
  // await ScrapedProduct.deleteMany({ source: "Instamart" });
  // console.log("Old data cleared.");

  await dairy();
  await fruits();
  await vegetables();
  await meat();
  await beverages();
};

export default scrapeAllInstamart;
