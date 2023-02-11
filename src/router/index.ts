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
      name: 'buyer',
      meta: { mode: 'backstage' },
      component: () => import('../views/backstage/Index.vue'),
      children: [
        {
          path: 'order',
          name: 'buyer-order',
          component: () => import('../views/backstage/buyer/Order.vue')
        },
        {
          path: '',
          name: 'buyer-index',
          component: () => import('../views/backstage/buyer/Order.vue')
        },
        {
          path: 'order/:oid',
          name: 'buyer-order-detail',
          component: () => import('../views/backstage/buyer/OrderDetail.vue')
        },
        {
          path: 'bid',
          name: 'buyer-bid',
          component: () => import('../views/backstage/buyer/Bid.vue')
        }
      ]
    },
    //卖家后台
    {
      path: '/seller',
      name: 'seller',
      meta: { mode: 'backstage' },
      component: () => import('../views/backstage/Index.vue'),
      children: [
        {
          path: 'order',
          name: 'seller-order',
          component: () => import('../views/backstage/seller/Order.vue')
        },
        {
          path: '',
          name: 'seller-index',
          component: () => import('../views/backstage/seller/Order.vue')
        },
        {
          path: 'order/:oid',
          name: 'seller-order-detail',
          component: () => import('../views/backstage/seller/OrderDetail.vue')
        },
        {
          path: 'bid',
          name: 'seller-bid',
          component: () => import('../views/backstage/seller/Bid.vue')
        }
      ]
    },
     //用户其他设置
     {
      path: '/home',
      name: 'home',
      meta: { mode: 'backstage' },
      component: () => import('@/views/backstage/Index.vue'),
      children: [
        {
          path: 'address',
          name: 'home-address',
          component: () => import('@/views/backstage/Address.vue')
        },
      ]
    },
  ]
})

export default router
