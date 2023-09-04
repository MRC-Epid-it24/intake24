import type { NavigationGuard } from 'vue-router';
import { isAxiosError } from 'axios';

import { useAuth, useSurvey, useUser } from '../stores';

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

export const authGuard: NavigationGuard = async (to, from, next) => {
  const {
    params: { token },
  } = to;

  try {
    const auth = useAuth();
    await auth.logout(true);
    await auth.token({ token });

    const surveyId = useUser().profile?.surveyId;

    next(surveyId ? { name: 'survey-home', params: { surveyId } } : { name: 'home' });
    return;
  } catch {
    next({ name: 'home' });
    return;
  }
};

export const globalGuard: NavigationGuard = async (to, from, next) => {
  const {
    meta: { module } = {},
    query: { auth: token, ...query },
  } = to;
  let {
    params: { surveyId },
  } = to;

  const auth = useAuth();

  // Try logging-in if we have authentication token
  if (typeof token === 'string' && token && !auth.loggedIn) {
    try {
      await auth.logout(true);
      await auth.token({ token });

      surveyId = useUser().profile?.surveyId ?? surveyId;
      const name = to.meta?.module === 'public' ? 'survey-home' : to.name ?? 'survey-home';

      next({ name, params: { surveyId }, query });
      return;
    } catch {
      next({ name: surveyId ? 'survey-login' : 'home', params: { surveyId } });
      return;
    }
  }

  // Public pages
  if (module === 'public') {
    next();
    return;
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
