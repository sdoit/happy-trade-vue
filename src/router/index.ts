import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      meta: { mode: 'reception' },
      component: () => import('../views/Index.vue')
    },
    {
      path: '/about',
      name: 'about',
      meta: { mode: 'reception' },
      component: () => import('../views/About.vue')
    },
    {
      path: '/search/:keyword',
      name: 'search',
      meta: { mode: 'reception' },
      component: () => import('../views/Search.vue')
    },
    {
      path: '/commodity/:cid',
      name: 'commodity',
      meta: { mode: 'reception' },
      component: () => import('../views/Commodity.vue')
    },
    //买家后台
    {
      path: '/buyer',
      meta: { mode: 'backstage' },
      component: () => import('../views/backstage/buyer/index.vue'),
      children: [
        {
          path: 'order',
          name: 'buyer-order',
          component: () => import('../views/backstage/buyer/order.vue')
        }
      ],

    }

  ]
})

export default router
