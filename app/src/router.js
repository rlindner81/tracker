import Vue from 'vue'
import Router from 'vue-router'
import PublicLayout from './layouts/Public.vue'
import ProtectedLayout from './layouts/Protected.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: PublicLayout,
      children: [
        { path: '/', component: () => import(/* webpackChunkName: "login" */ './views/Login.vue') },
        { path: '/register', component: () => import(/* webpackChunkName: "register" */ './views/Register.vue') }
      ]
    },
    {
      path: '/tracker',
      component: ProtectedLayout,
      children: [
        { path: '/', component: () => import(/* webpackChunkName: "dashboard" */ './views/Dashboard.vue') },
        { path: ':track', component: () => import(/* webpackChunkName: "tracker" */ './views/Tracker.vue') }
      ]
    }
  ]
})
