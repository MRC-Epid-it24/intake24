import './bootstrap';
import Vue from 'vue';
import './registerServiceWorker';
import { Chart, registerables } from 'chart.js';
import App from './App.vue';
import i18n from './i18n';
import http from './services/http.service';
import store from './store';
import createRouter from './router';
import vuetify from './plugins/vuetify';

Chart.register(...registerables);

const router = createRouter(store);

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
