import fetch from "node-fetch";
import * as cheerio from "cheerio";

const oneDayUrls = [
  "https://fubon-ebrokerdj.fbs.com.tw/z/zg/zgk.djhtm?A=D&B=0&C=1",
  "https://fubon-ebrokerdj.fbs.com.tw/z/zg/zgk.djhtm?A=DB&B=0&C=1",
  "https://fubon-ebrokerdj.fbs.com.tw/z/zg/zgk.djhtm?A=DD&B=0&C=1",
  "https://fubon-ebrokerdj.fbs.com.tw/z/zg/zgk.djhtm?A=F&B=0&C=1",
];
const fiveDayUrls = [
  "https://fubon-ebrokerdj.fbs.com.tw/z/zg/zgk.djhtm?A=D&B=0&C=5",
  "https://fubon-ebrokerdj.fbs.com.tw/z/zg/zgk.djhtm?A=DB&B=0&C=5",
  "https://fubon-ebrokerdj.fbs.com.tw/z/zg/zgk.djhtm?A=DD&B=0&C=5",
  "https://fubon-ebrokerdj.fbs.com.tw/z/zg/zgk.djhtm?A=F&B=0&C=5",
];
const tenDayUrls = [
  "https://fubon-ebrokerdj.fbs.com.tw/z/zg/zgk.djhtm?A=D&B=0&C=10",
  "https://fubon-ebrokerdj.fbs.com.tw/z/zg/zgk.djhtm?A=DB&B=0&C=10",
  "https://fubon-ebrokerdj.fbs.com.tw/z/zg/zgk.djhtm?A=DD&B=0&C=10",
  "https://fubon-ebrokerdj.fbs.com.tw/z/zg/zgk.djhtm?A=F&B=0&C=10",
];

async function scrapingData(urls) {
  const decoder = new TextDecoder("Big5");
  const lists = await Promise.all(
    urls.map(async (url) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          global.logger.error("Something wrong with one data fetching.");
          return [];
        }
        const buffer = await response.arrayBuffer();
        const text = decoder.decode(buffer);
        const $ = cheerio.load(text);
        const list = [];
        $("tbody .t3t1").each((_idx, el) => list.push($(el).text()));
        return list;
      } catch (err) {
        global.logger.error(err);
        return [];
      }
    })
  );
  const areAllErrors = lists.every((list) => list.length === 0);
  return areAllErrors ? [] : lists;
}

function seperateData(lists) {
  const buyLists = [];
  const sellLists = [];

  lists.forEach((list) => {
    const buyList = [];
    const sellList = [];
    list.forEach((stock, index) => {
      if (index % 2 === 0) {
        buyList.push(stock);
      } else {
        sellList.push(stock);
      }
    });
    buyLists.push(buyList);
    sellLists.push(sellList);
  });

  return [buyLists, sellLists];
}

function findRepeatedElements(arrays) {
  const frequencyMap = new Map();

  for (const array of arrays) {
    for (const element of array) {
      const count = frequencyMap.get(element) || 0;
      frequencyMap.set(element, count + 1);
    }
  }

  return Array.from(frequencyMap.entries())
    .filter(([element, count]) => count === arrays.length)
    .map(([element]) => element);
}

async function scrapeDataProcess(urls) {
  const rawData = await scrapingData(urls);
  if (rawData.length === 0) return [];
  const [buyLists, sellLists] = seperateData(rawData);
  const commonBuyList = findRepeatedElements(buyLists);
  const commonSellList = findRepeatedElements(sellLists);
  return [commonBuyList, commonSellList];
}

async function scrapeData() {
  const oneDayData = await scrapeDataProcess(oneDayUrls);
  const fiveDayData = await scrapeDataProcess(fiveDayUrls);
  const tenDayData = await scrapeDataProcess(tenDayUrls);
  if (
    oneDayData.length === 0 &&
    fiveDayData.length === 0 &&
    tenDayData.length === 0
  )
    return false;
  return { oneDayData, fiveDayData, tenDayData };
}

export default scrapeData;
