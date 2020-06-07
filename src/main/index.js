import { app, BrowserWindow, ipcMain } from "electron";

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
  global.__static = require("path")
    .join(__dirname, "/static")
    .replace(/\\/g, "\\\\");
}

let mainWindow;
let live2dWindow;
const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080/`
    : `file://${__dirname}/`;

function createWindow() {
  mainWindow = new BrowserWindow({
    height: 230,
    width: 200,
    resizable: false,
    title: "Atelier Pumpkin"
  });

  mainWindow.loadURL(winURL + "launcher.html");

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function launchLive2d(locale) {
  if (live2dWindow) {
    return;
  }
  live2dWindow = new BrowserWindow({
    height: 550,
    useContentSize: true,
    width: 950,
    show: false
  });

  live2dWindow.loadURL(winURL + "live2d.html");

  live2dWindow.once("ready-to-show", () => {
    if (locale) {
      live2dWindow.webContents.send("setLanguage", locale);
    }
    live2dWindow.show();
  });

  live2dWindow.on("closed", () => {
    live2dWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("launch-live2d", (event, locale) => {
  launchLive2d(locale);
});

ipcMain.on("setLanguage", (event, locale) => {
  if (live2dWindow) {
    live2dWindow.webContents.send("setLanguage", locale);
  }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
