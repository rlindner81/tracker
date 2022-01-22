import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import PublicLayout from "../layouts/Public.vue";
import ProtectedLayout from "../layouts/Protected.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/auth",
    component: PublicLayout,
    children: [
      {
        path: "login",
        component: () =>
          import(/* webpackChunkName: "login" */ "../views/Login.vue"),
      },
      {
        path: "register",
        component: () =>
          import(/* webpackChunkName: "register" */ "../views/Register.vue"),
      },
    ],
  },
  {
    path: "/",
    component: ProtectedLayout,
    children: [
      {
        path: "/",
        component: () =>
          import(/* webpackChunkName: "dashboard" */ "../views/Dashboard.vue"),
      },
      {
        path: ":track",
        component: () =>
          import(/* webpackChunkName: "track" */ "../views/Tracker.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
