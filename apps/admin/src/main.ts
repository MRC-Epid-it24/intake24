import './bootstrap';

import Vue from 'vue';

import pinia from '@intake24/ui/stores/bootstrap';

import App from './app.vue';
import i18n from './i18n';
import vuetify from './plugins/vuetify';
import router from './router';
import guards from './router/guards';
import http from './services/http.service';

guards(router);

Vue.config.productionTip = false;
Vue.prototype.$http = http;

new Vue({
  i18n,
  pinia,
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
