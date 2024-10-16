import Vue from 'vue';
import { Intersect, Resize, Ripple } from 'vuetify/lib/directives';

import { loading, platform } from './mixins';

// @ts-expect-error Vue2.7 types
Vue.mixin(loading);
// @ts-expect-error Vue2.7 types
Vue.mixin(platform);

Vue.directive('intersect', Intersect);
Vue.directive('resize', Resize);
Vue.directive('ripple', Ripple);
