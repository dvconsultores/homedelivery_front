import Vue from 'vue';
import Router from 'vue-router';
import goTo from 'vuetify/lib/services/goto'

Vue.use(Router);

export default new Router({
  scrollBehavior: (to, from, savedPosition) => {
    let scrollTo = 0
    if (to.hash) {
      scrollTo = to.hash
    } else if (savedPosition) {
      scrollTo = savedPosition.y
    }
    return goTo(scrollTo)
  },
  routes: [
    // path 1
    {
      path: '/',
      name: 'layout',
      component: () => import('@/layouts/layout/Layout'),
      children: [
        {
          path: '/home',
          name: 'inicio',
          component: () => import('@/pages/home/Home'),
        },
        {
          path: '/mi-perfil',
          name: 'perfil',
          component: () => import('@/components/forms/miPerfil/MiPerfil'),
        },
        {
          path: '/mi-menu',
          name: 'miMenu',
          component: () => import('@/components/forms/miMenu/MiMenu'),
        },
        // {
        //   path: '/mi-tienda',
        //   name: 'miTienda',
        //   component: () => import('@/components/forms/miTienda/MiTienda'),
        // },
        {
          path: '/mi-delivery',
          name: 'miDelivery',
          component: () => import('@/components/forms/miDelivery/MiDelivery'),
        },
        // {
        //   path: '/',
        //   name: 'inicio',
        //   component: () => import('@/pages/home/Home'),
        // },
        {
          path: '/restaurantes',
          name: 'restaurantes',
          component: () => import('@/pages/restaurantes/Restaurantes'),
        },
        {
          path: '/restaurante-tienda:id?',
          name: 'restauranteTienda',
          component: () => import('@/pages/restaurantes/RestauranteTienda'),
        },
        // {
        //   path: '/tienda',
        //   name: 'tienda',
        //   component: () => import('@/pages/tienda/Tienda'),
        // },
        {
          path: '/pedido',
          name: 'pedido',
          component: () => import('@/pages/pedido/Pedido'),
        },
      ],
    },
    // Last path (Errors)
    {
      path: '*',
      name: 'error',
      component: () => import('@/layouts/error/Error'),
    }
  ],
});
