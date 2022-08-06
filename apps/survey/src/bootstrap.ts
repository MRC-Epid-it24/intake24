import Vue from 'vue';

import loading from './mixins/loading';
import platform from './mixins/platform';

Vue.mixin(loading);
Vue.mixin(platform);
