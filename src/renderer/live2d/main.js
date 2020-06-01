import Vue from "vue";
import axios from "axios";

import App from "./App";
import store from "./store";

if (!process.env.IS_WEB) Vue.use(require("vue-electron"));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  components: { App },
  store,
  template: "<App/>"
}).$mount("#live2d"); // mount on the live2d div defined in laucher.ejs
