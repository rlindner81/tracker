import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import PublicLayout from "../layouts/Public.vue";
import ProtectedLayout from "../layouts/Protected.vue";

const routes: Array<RouteRecordRaw> = [
  {
    name: "Unprotected",
    path: "/auth",
    component: PublicLayout,
    children: [
      {
        name: "Login",
        path: "login",
        component: () =>
          import(/* webpackChunkName: "login" */ "../views/Login.vue"),
      },
      {
        name: "Register",
        path: "register",
        component: () =>
          import(/* webpackChunkName: "register" */ "../views/Register.vue"),
      },
    ],
  },
  {
    name: "Protected",
    path: "/",
    component: ProtectedLayout,
    children: [
      {
        name: "Home",
        path: "/",
        component: () =>
          import(/* webpackChunkName: "dashboard" */ "../views/Dashboard.vue"),
      },
      {
        name: "Track",
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
