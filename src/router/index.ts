import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Index.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/About.vue')
    },
    {
      path: '/search/:keyword',
      name: 'search',
      component: () => import('../views/Search.vue')
    },
    {
      path: '/commodity/:cid',
      name: 'commodity',
      component: () => import('../views/Commodity.vue')
    }
   
  ]
})

export default router
