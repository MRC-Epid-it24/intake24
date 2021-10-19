import { NavigationGuard } from 'vue-router';
import { Store } from 'vuex';
import { RootState } from '@/types/vuex';

export const surveyParametersGuard =
  (store: Store<RootState>): NavigationGuard =>
  async (to, from, next) => {
    const {
      params: { surveyId },
    } = to;

    if (!store.getters['survey/parametersLoaded'])
      await store.dispatch('survey/loadParameters', { surveyId });

    if (!store.getters['survey/parametersLoaded']) {
      next({ name: 'recall-error', params: { surveyId } });
      return;
    }

    next();
  };

export const surveyParametersErrorGuard =
  (store: Store<RootState>): NavigationGuard =>
  async (to, from, next) => {
    const {
      params: { surveyId },
    } = to;

    if (store.getters['survey/parametersLoaded']) {
      next({ name: 'recall', params: { surveyId } });
      return;
    }

    next();
  };

export const globalGuard =
  (store: Store<RootState>): NavigationGuard =>
  async (to, from, next) => {
    const {
      meta: { module } = {},
      params: { surveyId },
    } = to;

    // Public pages
    if (module === 'public') {
      next();
      return;
    }

    // Login pages (credentials / token)
    if (module === 'login') {
      if (store.getters['auth/loggedIn']) next({ name: 'dashboard', params: { surveyId } });
      else next();
      return;
    }

    // Get logged-in user information if not yet loaded
    if (!store.getters['auth/loggedIn']) await store.dispatch('auth/refresh', { withErr: false });

    // Any other page (requires to be logged in)
    if (!store.getters['auth/loggedIn']) {
      if (surveyId) next({ name: 'login', params: { surveyId } });
      else next({ name: 'home' });
      return;
    }

    next();
  };
