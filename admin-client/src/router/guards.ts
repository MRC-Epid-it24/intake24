import Router from 'vue-router';
import { Store } from 'vuex';
import { RootState } from '@/types/vuex';

export default (router: Router, store: Store<RootState>): void => {
  router.beforeEach(async (to, from, next) => {
    // Login page
    if (to.meta.public) {
      if (store.getters['user/loggedIn']) next({ name: 'dashboard' });
      else next();
      return;
    }

    // Get logged-in user information if not yet loaded
    if (!store.getters['user/loggedIn']) await store.dispatch('auth/refresh', { withErr: false });

    // Any other page (requires to be logged in)
    if (!store.getters['user/loggedIn']) {
      next({ name: 'login' });
      return;
    }

    // Check correct roles/permissions if any
    /* if (to.meta.perm && !store.getters['user/can'](to.meta.perm)) {
      next({ name: 'dashboard' });
      return;
    } */

    next();
  });
};
