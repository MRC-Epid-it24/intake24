import './bootstrap';

import type { Route } from 'vue-router';
import Vue from 'vue';
import VueGtag from 'vue-gtag';

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

Vue.use(
  VueGtag,
  {
    enabled: !!import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
    bootstrap: !!import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
    appName: import.meta.env.VITE_APP_NAME,
    config: {
      id: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
    },
    pageTrackerTemplate: (to: Route) => ({
      page_title: i18n.t(to.meta?.title).toString(),
      page_path: to.path,
    }),
  },
  router,
);

const vue = new Vue({
  i18n,
  pinia,
  router,
  vuetify,
  render: h => h(App),
});

vue.$http.init(router, useAuth);
vue.$mount('#app');
