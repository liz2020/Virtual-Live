const { BrowserWindow } = require("electron");

const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080/`
    : `file://${__dirname}/`;

let live2dWindow = null;

function create(locale) {
  if (live2dWindow) {
    return;
  }
  live2dWindow = new BrowserWindow({
    height: 550,
    useContentSize: true,
    width: 950,
    show: false,
    webPreferences: { nodeIntegration: true }
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

function send(channel, ...args) {
  live2dWindow.webContents.send(channel, ...args);
}

module.exports = { create, send };
