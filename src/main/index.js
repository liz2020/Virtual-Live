import { app, BrowserWindow } from "electron";

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
let mainWindow2;
const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080/`
    : `file://${__dirname}/`;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
    // show: false
  });

  mainWindow.loadURL(winURL + "index.html");

  // mainWindow.once("ready-to-show", () => {
  //   mainWindow.show();
  // });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function createWindow2() {
  /**
   * Initial window options
   */
  mainWindow2 = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
    // show: false
  });

  mainWindow2.loadURL(winURL + "live2d.html");

  // mainWindow.once("ready-to-show", () => {
  //   mainWindow.show();
  // });

  mainWindow2.on("closed", () => {
    mainWindow2 = null;
  });
}

app.on("ready", createWindow);
app.on("ready", createWindow2);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
  if (mainWindow2 === null) {
    createWindow2();
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
