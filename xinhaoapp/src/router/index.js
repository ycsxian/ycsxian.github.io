import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import AR from '@/components/AR'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'AR',
      component: AR
    },
    {
      path: '/',
      name: 'Hello',
      component: Hello
    }
  ]
})
