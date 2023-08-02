import type { NavigationGuard } from 'vue-router';
import { isAxiosError } from 'axios';

import { useAuth, useSurvey } from '../stores';

export const feedbackParametersGuard: NavigationGuard = async (to, from, next) => {
  const {
    meta: { module } = {},
    params: { surveyId },
  } = to;

  const auth = useAuth();
  const survey = useSurvey();

  try {
    if (!survey.parametersLoaded) await survey.loadParameters(surveyId);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 403) {
      await auth.logout(true);
      next({ name: 'survey-login', params: { surveyId } });
      return;
    }
    throw error;
  }

  if (!survey.parametersLoaded) {
    next({ name: `${module}-error`, params: { surveyId } });
    return;
  }

  if (!survey.user?.showFeedback) {
    next({ name: 'survey-home', params: { surveyId } });
    return;
  }

  next();
};

export const surveyParametersGuard: NavigationGuard = async (to, from, next) => {
  const {
    meta: { module } = {},
    params: { surveyId },
  } = to;

  const auth = useAuth();
  const survey = useSurvey();

  try {
    if (!survey.parametersLoaded) await survey.loadParameters(surveyId);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 403) {
      await auth.logout(true);
      next({ name: 'survey-login', params: { surveyId } });
      return;
    }
    throw error;
  }

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