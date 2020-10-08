import Vue from 'vue';
import Storage from 'vue-ls';
import Toasted from 'vue-toasted';

import isMobile from './mixins/isMobile';
import loading from './mixins/loading';

const options = { namespace: process.env.VUE_APP_PREFIX };
Vue.use(Storage, options);
Vue.ls.setOptions(options);

Vue.use(Toasted, {
  duration: 10000,
  keepOnHover: true,
  iconPack: 'fontawesome',
  position: 'bottom-center',
});

Vue.mixin(isMobile);
Vue.mixin(loading);
