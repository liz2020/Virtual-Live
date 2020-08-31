const { app } = require("electron");
const handleIPC = require("./ipc");
const { create: createTray, getLocale } = require("./windows/tray");
const { create: createLive2d } = require("./windows/live2d");

app.whenReady().then(async () => {
  await createTray();
  createLive2d(getLocale());
  handleIPC();
});
