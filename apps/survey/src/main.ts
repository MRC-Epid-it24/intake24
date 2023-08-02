import './bootstrap';

import Vue from 'vue';

import pinia from '@intake24/ui/stores/bootstrap';

import App from './app.vue';
import i18n from './i18n';
import vuetify from './plugins/vuetify';
import router from './router';
import { errorHandler, httpService } from './services';
import { useAuth } from './stores';

Vue.config.productionTip = false;
Vue.config.errorHandler = errorHandler;
Vue.prototype.$http = httpService;

const vue = new Vue({
  i18n,
  pinia,
  router,
  vuetify,
  render: (h) => h(App),
});

vue.$http.init(router, useAuth);
vue.$mount('#app');