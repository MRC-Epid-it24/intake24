import Vue from 'vue';

import loading from './mixins/loading';
import platform from './mixins/platform';

//@ts-expect-error Vue2.7 types
Vue.mixin(loading);
//@ts-expect-error Vue2.7 types
Vue.mixin(platform);
