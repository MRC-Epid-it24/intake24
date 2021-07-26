import Router from 'vue-router';
import { Store } from 'vuex';
import { RootState } from '@/types';

export default (router: Router, store: Store<RootState>): void => {
  router.beforeEach(async (to, from, next) => {
    const { meta: { perm, public: unrestricted } = {} } = to;

    // Login page
    if (unrestricted) {
      if (store.getters['auth/loggedIn']) next({ name: 'dashboard' });
      else next();
      return;
    }

    // Get logged-in user information if not yet loaded
    if (!store.getters['auth/loggedIn']) await store.dispatch('auth/refresh', { withErr: false });

    // Any other page (requires to be logged in)
    if (!store.getters['auth/loggedIn']) {
      next({ name: 'login' });
      return;
    }

    // Check correct permissions if any
    if (perm && !store.getters['user/can'](perm)) {
      next({ name: 'dashboard' });
      return;
    }

    next();
  });

  router.afterEach(async (to) => {
    const { meta: { module } = {} } = to;

    // Update module/resource name
    const value = module.parent ?? module.current;
    if (!store.getters['resource/name'] !== value) await store.dispatch('resource/update', value);
  });
};
