import scrapeData from "../utils/scrapeData.js";
import renderFile from "../utils/renderFile.js";
import { log, error } from "firebase-functions/logger";

async function generateIndex() {
  const data = await scrapeData();
  if (!data) {
    error("Scrapping data failed!");
    return;
  }
  const isRenderComplete = await renderFile(data);
  if (isRenderComplete) log("Scrape data successfully!");
}

export default generateIndex;
