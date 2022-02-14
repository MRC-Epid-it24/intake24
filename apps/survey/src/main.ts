import './registerServiceWorker';
import './bootstrap';
import Vue from 'vue';
import { Chart, registerables } from 'chart.js';
import pinia from './stores/bootstrap';
import App from './App.vue';
import i18n from './i18n';
import http from './services/http.service';
import router from './router';
import vuetify from './plugins/vuetify';

Chart.register(...registerables);

Vue.prototype.$http = http;
Vue.config.productionTip = false;

new Vue({
  i18n,
  pinia,
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
