const { Menu, Tray, session } = require("electron");
const { create: createLive2d, send: sendLive2d } = require("./live2d");

let tray = null;
let locale = null;

async function setLocale(newLocale) {
  locale = newLocale;
  let expiration = new Date();
  expiration.setFullYear(expiration.getFullYear() + 1);
  const cookie = {
    url: "https://github.com/liz2020/Virtual-Live/",
    name: "locale",
    value: locale,
    expirationDate: expiration.getTime()
  };
  session.defaultSession.cookies.set(cookie).then(
    () => {
      // success
    },
    error => {
      console.error(error);
    }
  );
}

async function create() {
  tray = new Tray("static/logo.png");

  await session.defaultSession.cookies
    .get({ url: "https://github.com/liz2020/Virtual-Live/", name: "locale" })
    .then(cookies => {
      if (cookies.length > 0) {
        locale = cookies[0]["value"];
      }
    })
    .catch(error => {
      console.log(error);
    });

  if (typeof locale != "string") {
    await setLocale("enUS");
  }

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Launch Live2d",
      click: async function() {
        createLive2d(locale);
      }
    },
    { type: "separator" },
    {
      label: "中文",
      type: "radio",
      checked: locale === "zhCN",
      click: async function() {
        setLocale("zhCN");
        sendLive2d("setLanguage", "zhCN");
      }
    },
    {
      label: "English",
      type: "radio",
      checked: locale === "enUS",
      click: async function() {
        setLocale("enUS");
        sendLive2d("setLanguage", "enUS");
      }
    },
    { type: "separator" },
    { label: "Quit Virtual-Live", role: "quit" }
  ]);
  tray.setToolTip("Virtual-Live");
  tray.setContextMenu(contextMenu);
}

function getLocale() {
  return locale;
}

module.exports = { create, getLocale };
