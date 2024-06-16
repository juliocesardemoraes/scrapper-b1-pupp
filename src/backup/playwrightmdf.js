const {
  _electron: electron,
  ElectronApplication,
  Page,
  JSHandle,
} = require("playwright");
// import { ElectronApplication, Page, JSHandle, _electron } from "playwright";

runB1Website = async () => {
  const app = await electron.launch({ args: ["."] });

  // Get the first window of the Electron app

  const window = await app.firstWindow();
  console.log(await window.title());

  const buttonSelector =
    'a.p-ripple.p-element.btn.btn-primary.ng-tns-c85-1:has-text("Login")';
  await window.waitForSelector(buttonSelector, { timeout: 15000 });
  await window.click(buttonSelector);

  await window.screenshot({ path: "intro.png" });
  bwHandle = await app.browserWindow(window);

  const buttonSelector =
    'a.p-ripple.p-element.btn.btn-primary.ng-tns-c85-1:has-text("Login")';
  await bwHandle.waitForSelector(buttonSelector, { timeout: 15000 });
  await bwHandle.click(buttonSelector);

  const inputUser = 'input[type="text"]';
  const inputPassword = 'input[type="password"]';

  await bwHandle.waitForSelector(inputUser);
  await bwHandle.fill(inputUser, process.env.B1_USERNAME);

  await window.click("submit-button-selector"); // Replace with the actual submit button selector

  await app.close();
};

module.exports = { runB1Website };
