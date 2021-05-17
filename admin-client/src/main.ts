import Vue from 'vue';
import './bootstrap';
import './registerServiceWorker';
import App from './App.vue';
import i18n from './locale';
import http from './services/http.service';
import router from './router';
import store from './store';
import guards from './router/guards';
import vuetify from './plugins/vuetify';

guards(router, store);

http.init(router, store);
Vue.prototype.$http = http;

Vue.config.productionTip = false;

new Vue({
  i18n,
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
