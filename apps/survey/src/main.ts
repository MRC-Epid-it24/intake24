import { createApp } from 'vue';
import VueGtag from 'vue-gtag';

import pinia from '@intake24/ui/stores/bootstrap';

import App from './app.vue';
import i18n from './i18n';
import { loading } from './mixins';
import vuetify from './plugins/vuetify';
import router from './router';
import { errorHandler, httpService } from './services';
import { useAuth } from './stores';

const app = createApp(App);

app.config.errorHandler = errorHandler;
// app.config.warnHandler = warnHandler;

app.config.globalProperties.$http = httpService;

// @ts-expect-error vue mixin type issue
app.mixin(loading);

app.use(router);
app.use(pinia);
app.use(i18n);
app.use(vuetify);
app.use(VueGtag, {
  enabled: !!import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
  bootstrap: !!import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
  appName: import.meta.env.VITE_APP_NAME,
  config: {
    id: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
  },
}, router);

app.mount('#app');

app.config.globalProperties.$http.init(router, useAuth);
