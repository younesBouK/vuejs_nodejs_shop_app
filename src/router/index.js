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
      path: '/shops',
      name: 'HelloWorld',
      component: Shops
    },
    {
      path: '/nearby-shops',
      name: 'HelloWorld',
      component: NearbyShops
    },
    {
      path: '/prefered-shops',
      name: 'HelloWorld',
      component: PreferedShops
    },
    {
      path: '/sign',
      name: 'HelloWorld',
      component: Sign
    }
  ]
})
