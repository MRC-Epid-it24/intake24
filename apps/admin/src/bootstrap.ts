import Vue from 'vue';
import { Intersect, Resize } from 'vuetify/lib/directives';

import authMixin from './mixins/auth';
import isMobile from './mixins/is-mobile';
import loadingMixin from './mixins/loading';
import moduleMixin from './mixins/module';

//@ts-expect-error Vue2.7 types
Vue.mixin(authMixin);
//@ts-expect-error Vue2.7 types
Vue.mixin(isMobile);
//@ts-expect-error Vue2.7 types
Vue.mixin(loadingMixin);
//@ts-expect-error Vue2.7 types
Vue.mixin(moduleMixin);

Vue.directive('intersect', Intersect);
Vue.directive('resize', Resize);
