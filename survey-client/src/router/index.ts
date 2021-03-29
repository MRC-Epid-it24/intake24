import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import { Store } from 'vuex';
import { RootState } from '@/types/vuex';
import views from '@/views';
import PortionTest from '@/views/PortionTest.vue';
import { globalGuard, recallGuard } from './guards';

Vue.use(VueRouter);

export default (store: Store<RootState>): VueRouter => {
  const beforeRecall = recallGuard(store);

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
    },

    // TESTING Temporary route for testing portion size code before foods & meals are loaded
    {
      path: '/:surveyId/portion-test',
      name: 'portion-test',
      component: PortionTest,
      meta: { module: 'public', title: 'portionTest._' },
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
    },
    {
      path: '/:surveyId/recall',
      name: 'recall',
      component: views.recall,
      meta: { module: 'recall', title: 'recall._' },
    },
    {
      path: '/:surveyId/recall/meals/:mealId/:questionId',
      name: 'recall-meals',
      component: views.recall,
      meta: { module: 'recall', title: 'recall._', section: 'meals' },
      beforeEnter: beforeRecall,
    },
    {
      path: '/:surveyId/recall/pre-meals/:questionId',
      name: 'recall-preMeals',
      component: views.recall,
      meta: { module: 'recall', title: 'recall._', section: 'preMeals' },
      beforeEnter: beforeRecall,
    },
    {
      path: '/:surveyId/recall/post-meals/:questionId',
      name: 'recall-postMeals',
      component: views.recall,
      meta: { module: 'recall', title: 'recall._', section: 'postMeals' },
      beforeEnter: beforeRecall,
    },
    {
      path: '/:surveyId/recall/submission/:questionId',
      name: 'recall-submission',
      component: views.recall,
      meta: { module: 'recall', title: 'recall._', section: 'submission' },
      beforeEnter: beforeRecall,
    },
    {
      path: '/:surveyId/feedback',
      name: 'feedback',
      component: views.feedback,
      meta: { module: 'feedback', title: 'feedback._' },
    },
    {
      path: '/:surveyId/:token',
      name: 'token',
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
