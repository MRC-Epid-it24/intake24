import Vue from 'vue';
import { Intersect, Resize } from 'vuetify/lib/directives';

import authMixin from './mixins/auth';
import isMobile from './mixins/is-mobile';
import loadingMixin from './mixins/loading';
import moduleMixin from './mixins/module';

Vue.mixin(authMixin);
Vue.mixin(isMobile);
Vue.mixin(loadingMixin);
Vue.mixin(moduleMixin);

Vue.directive('intersect', Intersect);
Vue.directive('resize', Resize);
