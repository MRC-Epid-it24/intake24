import './registerServiceWorker';
import './bootstrap';
import Vue from 'vue';
import pinia from './stores/bootstrap';
import App from './app.vue';
import i18n from './i18n';
import http from './services/http.service';
import router from './router';
import guards from './router/guards';
import vuetify from './plugins/vuetify';

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
