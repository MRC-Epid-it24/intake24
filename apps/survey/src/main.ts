/* eslint-disable perfectionist/sort-imports */
import { createApp } from 'vue';
import VueGtag from 'vue-gtag';
import pinia from '@intake24/ui/stores/bootstrap';
import App from './app.vue';
import i18n from './i18n';
import { loading } from './mixins';
import vuetify from './plugins/vuetify';
import router from './router';
import { errorHandler, httpService } from './services';
import { cookieConsentConfig, cookieConsentPlugin } from '@intake24/ui';
import { createManager } from '@vue-youtube/core';
import { createGtm } from '@gtm-support/vue-gtm';

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
app.use(VueGtag, { bootstrap: false }, router);
app.use(cookieConsentPlugin, cookieConsentConfig());
app.use(createManager({ deferLoading: { enabled: true, autoLoad: true } }));
app.use(createGtm({ id: import.meta.env.VITE_GTM_CONTAINER_ID, enabled: false, debug: true, vueRouter: router }));

app.mount('#app');

app.config.globalProperties.$http.init(router, useAuth);
