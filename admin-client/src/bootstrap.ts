import Vue from 'vue';
import Storage from 'vue-ls';
import Toasted from 'vue-toasted';

import loadingMixin from './mixins/loadingMixin';
import moduleMixin from './mixins/moduleMixin';

const options = { namespace: process.env.VUE_APP_PREFIX };
Vue.use(Storage, options);
Vue.ls.setOptions(options);

Vue.use(Toasted, {
  duration: 10000,
  keepOnHover: true,
  iconPack: 'fontawesome',
  position: 'bottom-center',
});

Vue.mixin(loadingMixin);
Vue.mixin(moduleMixin);
