import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import { Store } from 'vuex';
import { RootState } from '@/types/vuex';
import views from '@/views';
import PortionTest from '@/views/PortionTest.vue';

import { globalGuard, surveyParametersGuard } from './guards';

Vue.use(VueRouter);

export default (store: Store<RootState>): VueRouter => {
  const beforeDynamicRecall = surveyParametersGuard(store);

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
      component: views.login,
      meta: { module: 'login', title: 'login._' },
      props: true,
    },
    {
      path: '/:surveyId/dashboard',
      name: 'dashboard',
      component: views.dashboard,
      meta: { module: 'recall', title: 'recall.dynamicTitle' },
      props: true,
    },
    // v3-like dynamic recall logic prototype
    {
      path: '/:surveyId/dynamic-recall',
      name: 'dynamic-recall',
      component: views.dynamicRecall,
      meta: { module: 'recall', title: 'recall.dynamicTitle' },
      beforeEnter: beforeDynamicRecall,
    },

    // TESTING Temporary route for testing portion size code before foods & meals are loaded
    {
      path: '/:surveyId/portion-test',
      name: 'portion-test',
      component: PortionTest,
      meta: { module: 'recall', title: 'portionTest._' },
    },

    {
      path: '/:surveyId/profile',
      name: 'profile',
      component: views.profile,
      meta: { module: 'profile', title: 'profile._' },
    },
    {
      path: '/:surveyId/generate-user',
      name: 'generate-user',
      component: views.generateUser,
      meta: { module: 'public', title: 'login._' },
      props: true,
    },
    {
      path: '/:surveyId/feedback',
      name: 'feedback',
      component: views.feedback,
      meta: { module: 'feedback', title: 'feedback._' },
    },
    {
      path: '/:surveyId/:token',
      name: 'login-token',
      component: views.login,
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
