import Vue from 'vue';
import { Intersect, Resize } from 'vuetify/lib/directives';
import Toasted from 'vue-toasted';
import authMixin from './mixins/auth';
import isMobile from './mixins/is-mobile';
import loadingMixin from './mixins/loading';
import moduleMixin from './mixins/module';

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

Vue.directive('intersect', Intersect);
Vue.directive('resize', Resize);
