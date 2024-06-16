const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const playwright = require("playwright");

const createWindow = async () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  const url = "https://www.b1.bet/#/";
  mainWindow.loadURL(url);

  // Use Playwright to interact with the Electron window
  const browserContext = await playwright.chromium.launchPersistentContext("", {
    headless: false,
    args: [`--app=${url}`, "--window-size=1600,900"],
  });

  const [page] = browserContext.pages();
  // Wait for the page to be ready
  await page.waitForLoadState("domcontentloaded");

  // Select the button and perform actions
  const buttonSelector =
    'a.p-ripple.p-element.btn.btn-primary.ng-tns-c85-1:has-text("Login")';
  await page.waitForSelector(buttonSelector, { timeout: 15000 });
  await page.click(buttonSelector);

  // Print the page title
  console.log(await page.title());
};

// This method will be called when Electron has finished initialization and is ready to create browser windows.
app.whenReady().then(() => {
  createWindow();

  // On macOS, recreate a window when the dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
