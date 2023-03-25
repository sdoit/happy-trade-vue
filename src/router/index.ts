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
      path: '/type/:typeId',
      name: 'search-type',
      meta: { mode: 'reception' },
      component: () => import('../views/Search.vue')
    },
    {
      path: '/commodity/:cid',
      name: 'commodity',
      meta: { mode: 'reception', snapshot: false },
      component: () => import('../views/Commodity.vue')
    },
    {
      path: '/commodity/snapshot/:ssid',
      name: 'commodity-snapshot',
      meta: { mode: 'reception', snapshot: true },
      component: () => import('../views/Commodity.vue')
    },
    {
      path: '/request/:id',
      name: 'request',
      meta: { mode: 'reception', snapshot: false, request: true },
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
          path: '',
          name: 'buyer-index',
          component: () => import('../views/backstage/buyer/Order.vue')
        },

        {
          path: 'bid',
          name: 'buyer-bid',
          component: () => import('../views/backstage/buyer/Bid.vue')
        },
        {
          path: 'request',
          name: 'buyer-request',
          component: () => import('../views/backstage/buyer/Request.vue')
        },
        {
          path: 'favorites',
          name: 'buyer-favorites',
          component: () => import('../views/backstage/buyer/Favorites.vue')
        },
        {
          path: 'history',
          name: 'buyer-history',
          component: () => import('../views/backstage/buyer/History.vue')
        },
        {
          path: 'order',
          name: 'buyer-order',
          component: () => import('../views/backstage/buyer/Order.vue')
        },
        {
          path: 'order/:oid',
          name: 'buyer-order-detail',
          component: () => import('../views/backstage/buyer/OrderDetail.vue')
        },

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
          path: '',
          name: 'seller-index',
          component: () => import('../views/backstage/seller/Order.vue')
        },
        {
          path: 'bid',
          name: 'seller-bid',
          component: () => import('../views/backstage/seller/Bid.vue')
        },
        {
          path: 'bid/:cid',
          name: 'seller-bid-by-cid',
          meta: { mode: "cid" },
          component: () => import('../views/backstage/seller/Bid.vue')
        },
        {
          path: 'commodity',
          name: 'seller-commodity',
          component: () => import('../views/backstage/seller/Commodity.vue')
        },
        {
          path: 'order',
          name: 'seller-order',
          component: () => import('../views/backstage/seller/Order.vue')
        },
        {
          path: 'order/:oid',
          name: 'seller-order-detail',
          component: () => import('../views/backstage/seller/OrderDetail.vue')
        },

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
        {
          path: 'wallet',
          name: 'home-wallet',
          component: () => import('@/views/backstage/AccountBalance.vue')
        },
      ]
    },
    //商品发布
    {
      path: '/launch',
      name: 'launch',
      meta: { mode: 'backstage', request: false },
      component: () => import('../views/backstage/Launch.vue')
    },
    //发布求购
    {
      path: '/request',
      name: 'request-launch',
      meta: { mode: 'backstage', request: true },
      component: () => import('../views/backstage/Launch.vue')
    },
    //为求购发布商品
    {
      path: '/launch/:rid',
      name: 'launch-for-request',
      meta: { mode: 'backstage', request: false, launchForRequest: true },
      component: () => import('../views/backstage/Launch.vue')
    },
    //商品编辑
    {
      path: '/edit/:cid',
      name: 'edit',
      meta: { mode: 'backstage', edit: 'ture' },
      component: () => import('../views/backstage/Launch.vue')
    },
    //求购编辑
    {
      path: '/edit/request/:rid',
      name: 'edit-request',
      meta: { mode: 'backstage', edit: 'ture', request: true },
      component: () => import('../views/backstage/Launch.vue')
    },

    {
      path: '/empty',
      name: 'empty',
      component: () => import('@/views/error/404.vue')
    },


    //404
    {
      path: '/404',
      name: '404',
      component: () => import('@/views/error/404.vue')
    },
    {
      path: '/:pathMatch(.*)',
      redirect: '/404'
    }
  ]
})

export default router
