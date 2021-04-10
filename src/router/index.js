import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Trigonometry from "../views/Trigonometry.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue"),
  },

  {
    path: "/trigonometry",
    name: "trigonometry",
    component: Trigonometry,
  },

  {
    path: "/inversion",
    name: "inversion",
    component: () => import("../views/Inversion"),
  },
  {
    path: "/generate_art/wave",
    name: "generate_art_wave",
    component: () => import("../views/generate_art/Wave"),
  },

  {
    path: "/generate_art/partical",
    name: "generate_art_partical",
    component: () => import("../views/generate_art/Partical"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
