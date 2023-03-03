import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import fs from "fs";
import cookie from "./account/cookies.json" assert { type: "json" };
import { checkLogin } from "./utils/checkLogin.js";
import { writeRjcode, findRjDetails } from "./method.js";

const browserStart = async (account, { pageNum, pageSize }) => {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36"
  );

  // Check cookie
  await checkLogin(page, cookie, account);

  // Reuse cookie
  const cookiesString = await fs.readFileSync("./account/cookies.json");
  const cookies = await JSON.parse(cookiesString);
  await page.setCookie(...cookies);

  await page.goto(
    `https://hvdb.me/Dashboard/AllWorks/?page=${pageNum}&sort=downdatesort&pageSize=${pageSize}`,
    { waitUntil: "networkidle2" }
  );

  // Dashboard
  const dashboardData = await page.evaluate(() => {
    return {
      html: document.documentElement.innerHTML,
    };
  });

  const $ = await cheerio.load(dashboardData.html);
  let json = [];
  let rjCode = await $(".dlsiteCode").each((i, el) => {
    json.push({});
    json[i].rjCode = $(el).text().trim();
  });

  //___________WRITE RJCODES____________//
  await writeRjcode(json);

  //___________GET DATA EACH RJCODE____________//
  for (let rj of json) {
    await page.goto(`https://hvdb.me/Dashboard/WorkDetails/${rj.rjCode}`, {
      waitUntil: "networkidle2",
    });

    const rjData = await page.evaluate(() => {
      return {
        html: document.documentElement.innerHTML,
      };
    });

    await findRjDetails(rj.rjCode, rjData);
  }

  // Close browser
  console.log("Download Completed!");
  await browser.close();
};

const hvdb = async (account, { pageNum, pageSize }) => {
  browserStart(account, { pageNum, pageSize });
};

export { hvdb as startHvdb };
