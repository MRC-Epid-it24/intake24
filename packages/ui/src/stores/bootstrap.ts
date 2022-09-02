import { PiniaDebounce } from '@pinia/plugin-debounce';
import debounce from 'lodash/debounce';
import { createPinia, PiniaVuePlugin } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import Vue from 'vue';

Vue.use(PiniaVuePlugin);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
pinia.use(PiniaDebounce(debounce));

export default pinia;
