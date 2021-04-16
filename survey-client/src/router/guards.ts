import { NavigationGuard } from 'vue-router';
import { Store } from 'vuex';
import { RootState } from '@/types/vuex';

export const recallGuard = (store: Store<RootState>): NavigationGuard => async (to, from, next) => {
  const {
    params: { surveyId },
  } = to;

  // Load survey data
  if (!store.getters['recall/loaded']) await store.dispatch('recall/load', { surveyId });

  if (!store.getters['recall/loaded']) {
    next({ name: 'recall-entry', params: { surveyId } });
    return;
  }

  next();
};

export const surveyParametersGuard = (store: Store<RootState>): NavigationGuard => async (to, from, next) => {
  const {
    params: { surveyId },
  } = to;

  if (!store.getters['survey/parametersLoaded'])
    await store.dispatch('survey/loadParameters', { surveyId });

  // FIXME: if survey parameters fail to load for whatever reason this will cause an infinite loop
  //        and may crash the browser
  if (!store.getters['survey/parametersLoaded']) {
    next({ name: 'survey-entry', params: { surveyId } });
    return;
  }

  next();
};

export const globalGuard = (store: Store<RootState>): NavigationGuard => async (to, from, next) => {
  const {
    meta: { module },
    params: { surveyId },
  } = to;

  // Public pages
  if (module === 'public') {
    next();
    return;
  }

  // Login pages (credentials / token)
  if (module === 'login') {
    if (store.getters['user/loggedIn']) next({ name: 'recall-entry', params: { surveyId } });
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
};
