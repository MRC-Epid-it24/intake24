import trim from 'lodash/trim';
import Vue from 'vue';
import './bootstrap';
import './registerServiceWorker';
import App from './App.vue';
import i18n from './locale';
import http from './services/http.service';
import store from './store';
import createRouter from './router';
import vuetify from './plugins/vuetify';

const router = createRouter(store);

const baseUrl = [process.env.VUE_APP_API_HOST, process.env.VUE_APP_API_URL]
  .map((item) => trim(item, '/'))
  .join('/');

http.init(baseUrl);
http.mount401Interceptor(router, store);
Vue.prototype.$http = http;

Vue.config.productionTip = false;

new Vue({
  i18n,
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
