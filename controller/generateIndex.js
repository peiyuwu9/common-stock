import scrapeData from "../utils/scrapeData.js";
import renderFile from "../utils/renderFile.js";

async function generateIndex() {
  const data = await scrapeData();
  if (!data) {
    global.logger.info("Scrapping data failed!");
    return;
  }
  const isRenderComplete = await renderFile(data);
  if (isRenderComplete) global.logger.info("Scrape data successfully!");
}

export default generateIndex;
