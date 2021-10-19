import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import { Store } from 'vuex';
import { RootState } from '@/types/vuex';
import views from '@/views';
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
      name: 'login',
      component: views.survey.login,
      meta: { module: 'login', title: 'login._' },
      props: true,
    },
    {
      path: '/:surveyId/dashboard',
      name: 'dashboard',
      component: views.survey.dashboard,
      meta: { module: 'recall', title: 'recall.dynamicTitle' },
      props: true,
    },
    // v3-like dynamic recall logic prototype
    {
      path: '/:surveyId/recall',
      name: 'recall',
      component: views.survey.recall,
      meta: { module: 'recall', title: 'recall.dynamicTitle' },
      beforeEnter: surveyParametersGuard(store),
    },
    {
      path: '/:surveyId/error',
      name: 'recall-error',
      component: views.survey.error,
      meta: { module: 'recall', title: 'recall.dynamicTitle' },
      beforeEnter: surveyParametersErrorGuard(store),
    },

    // TESTING Temporary route for testing portion size code before foods & meals are loaded
    {
      path: '/:surveyId/portion-test',
      name: 'portion-test',
      component: views.survey.portionTest,
      meta: { module: 'recall', title: 'portionTest._' },
    },

    {
      path: '/:surveyId/profile',
      name: 'profile',
      component: views.survey.profile,
      meta: { module: 'profile', title: 'profile._' },
    },
    {
      path: '/:surveyId/generate-user',
      name: 'generate-user',
      component: views.survey.generateUser,
      meta: { module: 'public', title: 'login._' },
      props: true,
    },
    {
      path: '/:surveyId/feedback',
      name: 'feedback',
      component: views.survey.feedback,
      meta: { module: 'feedback', title: 'feedback._' },
    },
    {
      path: '/:surveyId/:token',
      name: 'login-token',
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
