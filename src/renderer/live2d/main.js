import Vue from "vue";
import axios from "axios";
import App from "./App";
import store from "./store";

import VueI18n from "vue-i18n";
import zhCN from "@live2d/locale/zhCN";
import enUS from "@live2d/locale/enUS";

if (!process.env.IS_WEB) Vue.use(require("vue-electron"));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: "enUS",
  messages: {
    zhCN: { message: zhCN },
    enUS: { message: enUS }
  }
});

/* eslint-disable no-new */
new Vue({
  components: { App },
  store,
  i18n,
  template: "<App/>"
}).$mount("#live2d"); // mount on the live2d div defined in laucher.ejs
