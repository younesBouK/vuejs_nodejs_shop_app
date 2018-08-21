import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Shops from '@/components/shops'
import NearbyShops from '@/components/shops'
import PreferedShops from '@/components/shops'
import Sign from '@/components/sign'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Shops
    },
    {
      path: '/shops',
      name: 'Shops',
      component: Shops
    },
    {
      path: '/sign',
      name: 'Sign',
      component: Sign
    }
  ]
})
