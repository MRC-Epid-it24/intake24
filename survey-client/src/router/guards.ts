import Router from 'vue-router';
import { Store } from 'vuex';
import { RootState } from '@/types/vuex';

export default (router: Router, store: Store<RootState>): void => {
  router.beforeEach(async (to, from, next) => {
    const {
      meta: { module },
      params: { surveyId },
    } = to;

    // Temporary route for portion testing
    if (module === 'portionTest') {
      next({ name: 'portion-test' });
      return;
    }

    // Public pages
    if (module === 'public') {
      next();
      return;
    }

    // Login pages (credentials / token)
    if (module === 'login') {
      if (store.getters['user/loggedIn']) next({ name: 'recall', params: { surveyId } });
      else next();
      return;
    }

    // Get logged-in user information if not yet loaded
    if (!store.getters['user/loggedIn']) await store.dispatch('auth/refresh', { withErr: false });

    // Any other page (requires to be logged in)
    if (!store.getters['user/loggedIn']) {
      if (surveyId) next({ name: 'login', params: { surveyId } });
      else next({ name: 'home' });
      return;
    }

    next();
  });
};
