import Vue from 'vue';
import { Intersect, Resize } from 'vuetify/lib/directives';

import { auth, isMobile, loading, module } from './mixins';

//@ts-expect-error Vue2.7 types
Vue.mixin(auth);
//@ts-expect-error Vue2.7 types
Vue.mixin(isMobile);
//@ts-expect-error Vue2.7 types
Vue.mixin(loading);
//@ts-expect-error Vue2.7 types
Vue.mixin(module);

Vue.directive('intersect', Intersect);
Vue.directive('resize', Resize);
