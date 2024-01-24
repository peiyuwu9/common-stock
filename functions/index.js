/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import { onSchedule } from "firebase-functions/v2/scheduler";
import { initializeApp } from "firebase/app";
import "dotenv/config";
import scrapeData from "./utils/scrapeData.js";
import renderFile from "./utils/renderFile.js";
import { log } from "firebase-functions/logger";

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGE_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};
initializeApp(firebaseConfig);

export const dailyJob = onSchedule("every day 13:00", async (event) => {
  const data = await scrapeData();
  if (Object.values(data).length === 0) return;
  const isRenderComplete = await renderFile(data);
  if (isRenderComplete) log("Scrape data successfully!");
});
