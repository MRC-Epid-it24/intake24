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
      path: '/:surveyId/generate-user',
      name: 'survey-generate-user',
      component: views.survey.generateUser,
      meta: { module: 'public', title: 'login._' },
      props: true,
    },
    {
      path: '/:surveyId/home',
      name: 'survey-home',
      component: views.survey.home,
      meta: { module: 'survey', title: 'recall.dynamicTitle' },
      beforeEnter: surveyParametersGuard(store),
      props: true,
    },
    {
      path: '/:surveyId/profile',
      name: 'survey-profile',
      component: views.survey.profile,
      meta: { module: 'survey', title: 'profile._' },
      beforeEnter: surveyParametersGuard(store),
      props: true,
    },
    {
      path: '/:surveyId/recall',
      name: 'survey-recall',
      component: views.survey.recallContainer,
      meta: { module: 'survey', title: 'recall.dynamicTitle' },
      beforeEnter: surveyParametersGuard(store),
      props: true,
    },
    {
      path: '/:surveyId/error',
      name: 'survey-error',
      component: views.survey.error,
      meta: { module: 'survey', title: 'recall.dynamicTitle' },
      beforeEnter: surveyParametersErrorGuard(store),
      props: true,
    },
    // Feedback
    {
      path: '/:surveyId/feedback',
      name: 'feedback-home',
      component: views.feedback.home,
      meta: { module: 'feedback', title: 'feedback._' },
      beforeEnter: surveyParametersGuard(store),
      props: true,
    },
    {
      path: '/:surveyId/feedback/error',
      name: 'feedback-error',
      component: views.survey.error,
      meta: { module: 'feedback', title: 'feedback._' },
      beforeEnter: surveyParametersErrorGuard(store),
      props: true,
    },
    {
      path: '/:surveyId/feedback/physical-data',
      name: 'feedback-physical-data',
      component: views.feedback.physicalData,
      meta: { module: 'feedback', title: 'feedback._' },
      beforeEnter: surveyParametersGuard(store),
      props: true,
    },

    // TESTING Temporary route for testing portion size code before foods & meals are loaded
    {
      path: '/:surveyId/portion-test',
      name: 'survey-portion-test',
      component: views.survey.portionTest,
      meta: { module: 'survey', title: 'portionTest._' },
      beforeEnter: surveyParametersGuard(store),
    },

    // Needs to be last as :token is param
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
