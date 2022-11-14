import Vue from "vue";
import Router from "vue-router";
import shop from "@/components/shop";
import promotion from "@/components/promotion";
import limeiPages from "@/components/limeiPages";

Vue.use(Router);

export default new Router({
  // mode: "history",
  routes: [
    // {
    //   path: "/",
    //   name: "shop",
    //   component: shop
    // },
    {
      path: "/",
      name: "salePageList",
      component: () => import("@/pages/salePageList.vue")
    },
    
    {
      path: "/promotion",
      name: "promotion",
      component: promotion
    },
    {
      path: "/updatePricePages",
      name: "updatePricePages",
      component: () => import("@/pages/updatePricePages.vue")
      // children: [
      //   // 这里的问题，子级路由前面不用加/ N
      //   {
      //     path: "limeiPagesTow",
      //     name: "limeiPagesTow",
      //     // component: limeiPagesTow
      //     component: () => import("@/pages/limeiPagesTow.vue")
      //   }
      // ]
    },
    {
      path: "/updatePricePagesTow",
      name: "updatePricePagesTow",
      component: () => import("@/pages/updatePricePagesTow.vue")
    },
    {
      path: "/changingOrRefunding",
      name: "changingOrRefunding",
      component: () => import("@/pages/changingOrRefunding.vue")
    },

    // {
    //   path: "/refundList",
    //   name: "refundList",
    //   component: () => import("@/components/refundList.vue")
    // },
    {
      path: "/refundPages",
      name: "refundPages",
      component: () => import("@/pages/refundPages.vue")
    },
    {
      path: "/salesReturnPages",
      name: "salesReturnPages",
      component: () => import("@/pages/salesReturnPages.vue")
    },
    {
      path: "/shipmentsPages",
      name: "shipmentsPages",
      component: () => import("@/pages/shipmentsPages.vue")
    },
    {
      path: "/shipmentsPagesTow",
      name: "shipmentsPagesTow",
      component: () => import("@/pages/shipmentsPagesTow.vue")
    },
    {
      path: "/salePageList",
      name: "salePageList",
      component: () => import("@/pages/salePageList.vue")
    },
  ]
});
