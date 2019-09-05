import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueRouter from 'vue-router'
import store from './store/index'
import router from './router/router'



Vue.config.productionTip = false;
Vue.use(VueRouter);


new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
