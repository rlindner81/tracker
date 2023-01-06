import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";

import PublicLayout from "@/layouts/Public.vue";
import ProtectedLayout from "@/layouts/Protected.vue";

const Login = () => import(/* webpackChunkName: "login" */ "@/views/Login.vue");
const Register = () => import(/* webpackChunkName: "register" */ "@/views/Register.vue");

const Home = () => import(/* webpackChunkName: "home" */ "@/views/Dashboard.vue");

const Track = () => import(/* webpackChunkName: "track" */ "@/views/Tracker.vue");

const routes: Array<RouteRecordRaw> = [
  {
    name: "Unprotected",
    path: "/auth",
    component: PublicLayout,
    children: [
      {
        name: "Login",
        path: "login",
        component: Login,
      },
      {
        name: "Register",
        path: "register",
        component: Register,
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
        component: Home,
      },
      {
        name: "Track",
        path: ":track",
        component: Track,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
