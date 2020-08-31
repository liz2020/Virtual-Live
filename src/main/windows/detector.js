const { BrowserWindow } = require("electron");

const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080/`
    : `file://${__dirname}/`;
let detectionWorker = null;

function create() {
  if (detectionWorker) {
    return;
  }

  detectionWorker = new BrowserWindow({
    show: false,
    webPreferences: { nodeIntegration: true }
  });

  detectionWorker.loadURL(winURL + "detection.html");

  detectionWorker.on("closed", () => {
    detectionWorker = null;
  });
}

function send(channel, ...args) {
  detectionWorker.webContents.send(channel, ...args);
}

module.exports = { create, send };
