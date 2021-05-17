import Router from 'vue-router';
import { Store } from 'vuex';
import { RootState } from '@/types/vuex';

export default (router: Router, store: Store<RootState>): void => {
  router.beforeEach(async (to, from, next) => {
    // Login page
    if (to.meta.public) {
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
    if (to.meta.perm && !store.getters['user/can'](to.meta.perm)) {
      next({ name: 'dashboard' });
      return;
    }

    if (!store.getters['resource/name'] !== to.meta.module)
      await store.dispatch('resource/update', to.meta.module);

    next();
  });
};
