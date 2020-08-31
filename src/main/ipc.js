const { ipcMain } = require("electron");
const { create: createLive2d, send: sendLive2d } = require("./windows/live2d");
const {
  create: createDetector,
  send: sendDetector
} = require("./windows/detector");

module.exports = function() {
  ipcMain.on("launch-live2d", (event, locale) => {
    createLive2d(locale);
  });

  ipcMain.on("launch-detection", () => {
    createDetector();
  });

  ipcMain.on("setLanguage", (event, locale) => {
    sendLive2d("setLanguage", locale);
  });

  ipcMain.on("window-message-from-worker", (event, arg) => {
    sendLive2d("window-message-from-worker", arg);
  });

  ipcMain.on("setVideoDevice", (event, deviceId) => {
    sendDetector("setVideoDevice", deviceId);
  });

  ipcMain.on("startDetection", (event, deviceId) => {
    sendDetector("startDetection", deviceId);
  });

  ipcMain.on("stopDetection", () => {
    sendDetector("stopDetection", null);
  });
};
