import Vue from "vue";
import axios from "axios";

import App from "./App";
import router from "./router";
import store from "./store";

import VueI18n from "vue-i18n";
import zhCN from "@launcher/locale/zhCN";
import enUS from "@launcher/locale/enUS";

import { UserConfig } from "@/config";

if (!process.env.IS_WEB) Vue.use(require("vue-electron"));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: UserConfig.getInstance().get("locale") || "enUS",
  messages: {
    zhCN: { message: zhCN },
    enUS: { message: enUS }
  }
});

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  i18n,
  template: "<App/>"
}).$mount("#app"); // mount on the app div defined in laucher.ejs
