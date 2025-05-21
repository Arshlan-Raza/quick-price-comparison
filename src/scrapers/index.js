import connectProductDB from "../confiq/productConnection.js";
import scrapeAllBlinkit from "./blinkit/index.js";
import scrapeAllZepto from "./zepto/index.js";
import scrapeAllInstamart from "./swiggy/index.js";
import scrapeAllBigBasket from "./bigbasket/index.js";

const run = async () => {
  await connectProductDB();
  // await scrapeAllBlinkit();
  // await scrapeAllInstamart();
  // await scrapeAllBigBasket();
  await scrapeAllZepto();
  process.exit(0);
};

run();
