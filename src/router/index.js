import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/views/Home";
import Restaurant from "@/views/Restaurant";
import User from "@/views/User";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/restaurant/:id",
    name: "Restaurant",
    component: Restaurant,
  },
  {
    path: "/user",
    name: "User",
    component: User,
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
