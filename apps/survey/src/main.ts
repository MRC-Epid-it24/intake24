import './registerServiceWorker';
import './bootstrap';
import '@intake24/ui/bootstrap';
import Vue from 'vue';
import pinia from '@intake24/ui/stores/bootstrap';
import i18n from './i18n';
import App from './app.vue';
import http from './services/http.service';
import router from './router';
import vuetify from './plugins/vuetify';

Vue.prototype.$http = http;
Vue.config.productionTip = false;

new Vue({
  i18n,
  pinia,
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
