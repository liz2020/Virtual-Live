import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "ChromaKey",
      component: require("@/components/ChromaKey").default
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
});
