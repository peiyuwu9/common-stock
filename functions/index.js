/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import { onSchedule } from "firebase-functions/v2/scheduler";
import { initializeApp } from 'firebase/app';
import scrapeData from "./utils/scrapeData.js";
import renderFile from "./utils/renderFile.js";
import { log } from "firebase-functions/logger";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDkDcPq8XE6Y12WzQfQvO4EDkNNldIZ_Y8",
  authDomain: "common-stock.firebaseapp.com",
  projectId: "common-stock",
  storageBucket: "common-stock.appspot.com",
  messagingSenderId: "399529407650",
  appId: "1:399529407650:web:d2a59c72859c1476c4d3fb",
  measurementId: "G-GR1L6C9LZD",
};
initializeApp(firebaseConfig);

export const dailyJob = onSchedule("every day 13:00", async (event) => {
  const data = await scrapeData();
  if (Object.values(data).length === 0) return;
  const isRenderComplete = await renderFile(data);
  if (isRenderComplete) log("Scrape data successfully!");
});
