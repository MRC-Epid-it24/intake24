import type { NavigationGuard } from 'vue-router';

import { useAuth, useSurvey } from '../stores';

export const surveyParametersGuard: NavigationGuard = async (to, from, next) => {
  const {
    meta: { module } = {},
    params: { surveyId },
  } = to;

  const survey = useSurvey();

  if (!survey.parametersLoaded) await survey.loadParameters(surveyId);

  if (!survey.parametersLoaded) {
    next({ name: `${module}-error`, params: { surveyId } });
    return;
  }

  next();
};

export const surveyParametersErrorGuard: NavigationGuard = async (to, from, next) => {
  const {
    meta: { module } = {},
    params: { surveyId },
  } = to;

  if (useSurvey().parametersLoaded) {
    next({ name: `${module}-home`, params: { surveyId } });
    return;
  }

  next();
};

export const globalGuard: NavigationGuard = async (to, from, next) => {
  const {
    meta: { module } = {},
    params: { surveyId },
    query: { token, ...restQuery },
  } = to;

  const auth = useAuth();

  // Public pages
  if (module === 'public') {
    next();
    return;
  }

  // Try logging-in if we have token
  if (typeof token === 'string' && token && !auth.loggedIn) {
    try {
      await auth.logout(true);
      await auth.token({ token });
      next({ name: to.name ?? 'survey-home', params: { surveyId }, query: restQuery });
      return;
    } catch {
      next({ name: 'survey-login', params: { surveyId } });
      return;
    }
  }

  // Login pages (credentials / token)
  if (module === 'login') {
    if (auth.loggedIn) next({ name: 'survey-home', params: { surveyId } });
    else next();
    return;
  }

  // Get logged-in user information if not yet loaded
  if (!auth.loggedIn) await auth.refresh(false);

  // Any other page (requires to be logged in)
  if (!auth.loggedIn) {
    if (surveyId) next({ name: 'survey-login', params: { surveyId } });
    else next({ name: 'home' });
    return;
  }

  next();
};
