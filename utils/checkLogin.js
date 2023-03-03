import fs from "fs";

const checkLogin = async (page, cookie, account) => {
  if (cookie === undefined || cookie.length == 0) {
    await page.goto("http://hvdb.me/Account/Login", {
      waitUntil: "networkidle2",
    });

    // Type form data
    await page.type("#Username", account.username);
    await page.type("#Password", account.password);
    await page.click(".submit.button");

    console.log("Successfuly Login!");

    // Create cookies
    const cookies = await page.cookies();
    const cookieJson = JSON.stringify(cookies, null, 2);
    await fs.writeFileSync("./account/cookies.json", cookieJson);
  }
};

export { checkLogin };
