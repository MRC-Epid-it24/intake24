import Vue from 'vue';
import Toasted from 'vue-toasted';
import loading from './mixins/loading';
import platform from './mixins/platform';

Vue.use(Toasted, {
  duration: 10000,
  keepOnHover: true,
  iconPack: 'fontawesome',
  position: 'bottom-center',
});

Vue.mixin(loading);
Vue.mixin(platform);
