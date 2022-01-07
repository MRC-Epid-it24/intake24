import Vue from 'vue';
import Storage from 'vue-ls';
import Toasted from 'vue-toasted';

import authMixin from './mixins/auth';
import isMobile from './mixins/is-mobile';
import loadingMixin from './mixins/loading';
import moduleMixin from './mixins/module';

const options = { namespace: process.env.VUE_APP_PREFIX };
Vue.use(Storage, options);
Vue.ls.setOptions(options);

Vue.use(Toasted, {
  duration: 10000,
  keepOnHover: true,
  iconPack: 'fontawesome',
  position: 'bottom-center',
});

Vue.mixin(authMixin);
Vue.mixin(isMobile);
Vue.mixin(loadingMixin);
Vue.mixin(moduleMixin);
