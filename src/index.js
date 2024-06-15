const { app, BrowserWindow } = require("electron");
const path = require("node:path");
const pie = require("puppeteer-in-electron");
const puppeteer = require("puppeteer-core");

const main = async () => {
  try {
    await pie.initialize(app);
    const browser = await pie.connect(app, puppeteer);

    const window = new BrowserWindow({
      width: 1600,
      height: 900,
    });
    const url = "https://www.b1.bet/#/";
    await window.loadURL(url);

    const page = await pie.getPage(browser, window);
    console.log(await page.title());

    // Click on login
    const loginSelector = "text/Login";
    const element = await page.waitForSelector(loginSelector);
    await page.click(loginSelector);

    // Fill login
    const inputUser = 'input[type="text"]';
    const inputPassword = 'input[type="password"]';
    const userName = "SpaceAquelino";
    const userPass = "@Aquelino88653361";

    await page.waitForSelector(inputUser, { visible: true, timeout: 3000 });
    const input = await page.$(inputUser);
    await input?.type(userName);
    await page.waitForSelector(inputPassword, { visible: true, timeout: 3000 });
    const inputPass = await page.$(inputPassword);
    await inputPass?.type(userPass);

    const buttonSelector = "button.p-ripple.p-element.btn.btn-primary";
    await page.waitForSelector(buttonSelector, { timeout: 15000 });
    await page.click(buttonSelector);
  } catch (error) {
    console.log("err", error);
  }
};

main();

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

if (require("electron-squirrel-startup")) {
  app.quit();
}
