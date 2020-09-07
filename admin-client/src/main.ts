import trim from 'lodash/trim';
import Vue from 'vue';
import './bootstrap';
// TODO
// Disable Service worker for now
// admin tool per-request nonces for Google reCAPTCHA
// import './registerServiceWorker';
import App from './App.vue';
import i18n from './locale';
import http from './services/http.service';
import router from './router';
import store from './store';
import guards from './router/guards';
import vuetify from './plugins/vuetify';

guards(router, store);

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
