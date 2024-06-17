const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const createWindow = async () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"));
  // mainWindow.webContents.openDevTools();
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
