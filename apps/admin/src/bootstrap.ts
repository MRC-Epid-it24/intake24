import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';
import Toasted from 'vue-toasted';
import authMixin from './mixins/auth';
import isMobile from './mixins/is-mobile';
import loadingMixin from './mixins/loading';
import moduleMixin from './mixins/module';

Vue.use(VueCompositionAPI);

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
