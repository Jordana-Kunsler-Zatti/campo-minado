const routes = [
  {
    path: "/",
    name: "",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/IndexPage.vue") }],
  },
  {
    path: "/jogo",
    name: "jogo",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "/jogo", component: () => import("pages/GamePage.vue") },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
