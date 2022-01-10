import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import { Store } from 'vuex';
import { RootState } from '@intake24/survey/types/vuex';
import views from '@intake24/survey/views';
import { globalGuard, surveyParametersGuard, surveyParametersErrorGuard } from './guards';

Vue.use(VueRouter);

export default (store: Store<RootState>): VueRouter => {
  const routes: RouteConfig[] = [
    {
      path: '/',
      name: 'home',
      component: views.home,
      meta: { module: 'public', title: 'common._' },
    },
    {
      path: '/:surveyId',
      name: 'survey-login',
      component: views.survey.login,
      meta: { module: 'login', title: 'login._' },
      props: true,
    },
    {
      path: '/:surveyId/dashboard',
      name: 'survey-dashboard',
      component: views.survey.dashboard,
      meta: { module: 'survey', title: 'recall.dynamicTitle' },
      beforeEnter: surveyParametersGuard(store),
      props: true,
    },
    // v3-like dynamic recall logic prototype
    {
      path: '/:surveyId/recall',
      name: 'survey-recall',
      component: views.survey.recallContainer,
      meta: { module: 'survey', title: 'recall.dynamicTitle' },
      beforeEnter: surveyParametersGuard(store),
    },
    {
      path: '/:surveyId/error',
      name: 'survey-error',
      component: views.survey.error,
      meta: { module: 'recall', title: 'recall.dynamicTitle' },
      beforeEnter: surveyParametersErrorGuard(store),
    },

    // TESTING Temporary route for testing portion size code before foods & meals are loaded
    {
      path: '/:surveyId/portion-test',
      name: 'survey-portion-test',
      component: views.survey.portionTest,
      meta: { module: 'survey', title: 'portionTest._' },
      beforeEnter: surveyParametersGuard(store),
    },
    {
      path: '/:surveyId/profile',
      name: 'survey-profile',
      component: views.survey.profile,
      meta: { module: 'survey', title: 'profile._' },
      beforeEnter: surveyParametersGuard(store),
    },
    {
      path: '/:surveyId/generate-user',
      name: 'survey-generate-user',
      component: views.survey.generateUser,
      meta: { module: 'public', title: 'login._' },
      props: true,
    },
    {
      path: '/:surveyId/feedback',
      name: 'survey-feedback',
      component: views.survey.feedback,
      meta: { module: 'survey', title: 'feedback._' },
      beforeEnter: surveyParametersGuard(store),
    },
    {
      path: '/:surveyId/:token',
      name: 'survey-login-token',
      component: views.survey.login,
      meta: { module: 'login', title: 'login._' },
    },
    // Catch any unmatched routes
    {
      path: '*',
      name: '404',
      component: views.home,
      meta: { module: 'public', title: 'common._' },
    },
  ];

  const router = new VueRouter({
    mode: 'history',
    base: process.env.VUE_APP_BASE_URL ?? '/',
    routes,
  });

  router.beforeEach(globalGuard(store));

  return router;
};
