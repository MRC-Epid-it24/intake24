import { PiniaDebounce } from '@pinia/plugin-debounce';
import debounce from 'lodash/debounce';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
pinia.use(PiniaDebounce(debounce));

export default pinia;
