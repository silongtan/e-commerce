import Vue from "vue";

import App from "@/App.vue";
import VueRouter from "vue-router";

import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes: [
    { path: "/", component: () => import("@/views/HomeView.vue") },
    {
      path: "/login",
      component: () => import("@/views/LoginView.vue"),
    },
    {
      path: "/register",
      component: () => import("@/views/RegisterView.vue"),
    },

    {
      path: "/product/:productId",
      component: () => import("@/views/ProductDetailView.vue"),
      props: ({ params: { productId } }) => ({ productId }),
    },
    {
      path: "/newProduct",
      component: () => import("@/views/NewProductView.vue"),
    },

    {
      path: "/orders",
      component: () => import("@/views/OrderView.vue"),
    },
    { path: "*", component: () => import("@/views/PageNotFoundView.vue") },
  ],
});

Vue.config.productionTip = false;
Vue.config.devtools = true;

/* eslint-disable no-new */
new Vue({
  router,
  el: "#app",
  render: (h) => h(App),
});
