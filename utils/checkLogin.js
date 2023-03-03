import fs from "fs";

const checkLogin = async (page, cookie, account) => {
  if (!cookie[0]) {
    await page.waitForNavigation({ waitUntil: "networkidle2" });

    await page.goto("https://hvdb.me/Account/Login", {
      waitUntil: "networkidle2",
    });

    // Set screen size
    await page.setViewport({ width: 1600, height: 900 });

    // Type form data
    await page.type("#Username", account.username);
    await page.type("#Password", account.password);
    await page.click(".submit.button");
    await page.waitForNavigation({ waitUntil: "networkidle2" });

    console.log("Successfuly Login!");

    // Create cookies
    const cookies = await page.cookies();
    const cookieJson = JSON.stringify(cookies, null, 2);
    await fs.writeFileSync("./account/cookies.json", cookieJson);
  }
};

export { checkLogin };
