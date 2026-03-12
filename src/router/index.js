import { createRouter, createWebHistory } from "vue-router";
import DashboardView from "../views/DashboardView.vue";
import TasksView from "../views/TasksView.vue";
import RulesView from "../views/RulesView.vue";
import HabitsView from "@/views/HabitsView.vue";

const routes = [
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardView,
  },
  {
    path: "/tasks",
    name: "tasks",
    component: TasksView,
  },
  {
    path: "/habits",
    name: "habits",
    component: HabitsView,
  },
  {
    path: "/rules",
    name: "rules",
    component: RulesView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
