import fs from "fs";
import download from "download";
import * as cheerio from "cheerio";

const writeRjcode = async (json) => {
  //___________CREATE EACH RJCODES FOLDER____________//
  for (let rj of json) {
    let code = rj.rjCode;
    code = code.replace("★", "");
    let dir = `./rjCode/RJ${code}`;
    if (!fs.existsSync(dir)) {
      await fs.mkdirSync(dir, { recursive: true });
    }
  }

  json = JSON.stringify(json);
  fs.writeFile("./rjCode/rjCode.json", json, (err) => {
    if (err) {
      throw err;
    }
  });
};

const findRjDetails = async (rjcode, html) => {
  // Find Details
  const $ = await cheerio.load(html.html);
  // The Details
  let RJCode = await $("h2").text().trim();
  let Title = await $("label#circleLabel").first().text().trim();
  let Circle = await $(".detailCircle").text().trim();
  let Image = await $("img").attr("src");
  let DownloadLink = await $("button.downloadLink").attr("data-clipboard-text");
  if (DownloadLink === undefined || DownloadLink === "undefined") {
    DownloadLink = "";
  }
  let finalData = `RJCode : ${RJCode}\nTitle : ${Title}\nCircle : ${Circle}\nImage Link : hvdb.me${Image}\nDownload Link : ${DownloadLink}}`;
  let dir = `./rjCode/RJ${rjcode}`;
  fs.writeFile(`${dir}/Data.txt`, finalData, (err) => {
    if (err) {
      throw err;
    }
  });
  // Download Image
  let imageFetch = await download(
    `https://hvdb.me${Image}`,
    `./rjCode/RJ${rjcode}/`
  );
  console.log(`"${Title}" has been downloaded!`);
};

export { writeRjcode, findRjDetails };
