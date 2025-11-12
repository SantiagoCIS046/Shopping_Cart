import { createRouter, createWebHistory } from "vue-router";
import Shopping from "../views/Shopping.vue";
import Login from "../views/Login.vue";

const routes = [
  {
    path: "/",
    name: "Shopping",
    component: Shopping,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
