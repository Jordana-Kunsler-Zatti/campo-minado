const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'index', component: () => import('pages/IndexPage.vue') },
      { path: 'game', name: 'game', component: () => import('pages/GamePage.vue') }
    ]
  },
  // {
  //   path: "/jogo",
  //   name: "jogo",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     { path: "/jogo", component: () => import("pages/GamePage.vue") },
  //   ],
  // },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
