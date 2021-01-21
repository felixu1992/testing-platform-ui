import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/ant-design-vue.js'
import './plugins/axios.js'
import './plugins/api.js'
import './plugins/mavon-enditor.js'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
