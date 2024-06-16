const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const createWindow = async () => {
  const url = "https://www.b1.bet/#/";
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL(url);

  const window = await mainWindow.firstWindow();
  console.log(await window.title());

  const buttonSelector =
    'a.p-ripple.p-element.btn.btn-primary.ng-tns-c85-1:has-text("Login")';
  await window.waitForSelector(buttonSelector, { timeout: 15000 });
  await window.click(buttonSelector);
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
