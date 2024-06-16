const playwright = require("playwright");
const name = document.getElementById("name");
const pass = document.getElementById("pass");
const passBtn = document.getElementById("passBtn");
let page = null;

const startBtn = document.getElementById("startBtn");
startBtn.onclick = async (e) => {
  console.log("ENTROUE");
  const url = "https://www.b1.bet/#/";
  const browserContext = await playwright.chromium.launchPersistentContext("", {
    headless: false,
    args: [`--app=${url}`, "--window-size=1920,1080"],
  });

  [page] = browserContext.pages();
  // Wait for the page to be ready
  await page.waitForLoadState("domcontentloaded");

  // Select the button and perform actions
  const buttonSelector =
    'a.p-ripple.p-element.btn.btn-primary.ng-tns-c85-1:has-text("Login")';
  await page.waitForSelector(buttonSelector, { timeout: 15000 });
  await page.click(buttonSelector);

  // Print the page title
  console.log(await page.title());
  // Selectors
  const inputUser = 'input[type="text"]';
  const inputPassword = 'input[type="password"]';

  // Selectors values
  const name = "SpaceAquelino";
  const pass = "@Aquelino88653361";
  const ROULETTE_URL =
    "https://www.b1.bet/#/game/casinolive?st=&stTp=1&p=480&t=1&g=SWS-playtech:RoletaBrasileria&lp=480";

  await page.waitForSelector(inputUser);
  await page.fill(inputUser, name);

  await page.waitForSelector(inputPassword);
  await page.fill(inputPassword, pass);

  await page.press(inputPassword, "Enter");
  // await page.click("submit-button-selector"); // Replace with the actual submit button selector

  const responsePromise = page.waitForResponse(
    (resp) =>
      resp.url().includes("/api/Login_Authenticate") && resp.status() === 200
  );
  await responsePromise;
  await page.waitForTimeout(2000);

  await page.goto("https://www.b1.bet/#/game/casinolive", {
    waitUntil: "networkidle",
  });
  await page.goto(`${ROULETTE_URL}`, {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(12000);

  const iframeHandle = await page.$("#SOSWScriptWdget > iframe");
  const src = await iframeHandle.getAttribute("src");
  await page.goto(src);

  await page.waitForTimeout(5000);

  // Convert the XPath to a CSS selector
  const closeButtonSelector = "div.close-button.header__close-button";

  // Click the button using the CSS selector
  await page.click(closeButtonSelector);

  const svgButtonSelector = "svg.close-button__icon";

  // Click the button using the CSS selector
  await page.click(svgButtonSelector);
  console.log("SAJUISJDHUASHJ");
};

passBtn.onclick = async (e) => {
  if (!page) return;

  const inputName = name.value;
  console.log(inputName);
  const inputUser = 'input[type="text"]';
  await page.waitForSelector(inputUser);
  await page.fill(inputUser, inputName);
};
