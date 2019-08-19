import Vue from 'vue'
import moment from 'moment'
import App from './App.vue'
import axios from './axios'
import router from './router'
import store from './store'
import './registerServiceWorker'

Vue.config.productionTip = false
Vue.prototype.$http = axios

Vue.filter('date', value => {
  return value ? moment(value).format('DD.MM.YYYY HH:mm') : null
})

Vue.filter('relativeDate', value => {
  return value ? moment(value).fromNow() : null
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
