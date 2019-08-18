import axios from 'axios'
import store from './store'

axios.interceptors.request.use(config => {
  store.commit('busy/start')
  return config
}, (error) => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  store.commit('busy/end')
  return response
}, (error) => {
  store.commit('error/raw', error)
  store.commit('busy/end')

  return Promise.reject(error)
})

export default axios.create()
