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

    // Testing Meals List
    {
      path: '/:surveyId/recall/meals_test',
      name: 'recall-meals_test',
      component: views.recall.meals,
      meta: { module: 'recall', title: 'recall._' },
      props: true,
      beforeEnter: beforeRecall,
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
      name: 'recall-entry',
      component: views.recall.entry,
      meta: { module: 'recall', title: 'recall._' },
      props: true,
      beforeEnter: beforeRecall,
    },
    {
      path: '/:surveyId/recall/meals/:mealId/:questionId?',
      name: 'recall-meals',
      component: views.recall.flow,
      meta: { module: 'recall', title: 'recall._', section: 'meals' },
      props: true,
      beforeEnter: beforeRecall,
    },
    {
      path: '/:surveyId/recall/pre-meals/:questionId?',
      name: 'recall-preMeals',
      component: views.recall.flow,
      meta: { module: 'recall', title: 'recall._', section: 'preMeals' },
      props: true,
      beforeEnter: beforeRecall,
    },
    {
      path: '/:surveyId/recall/post-meals/:questionId?',
      name: 'recall-postMeals',
      component: views.recall.flow,
      meta: { module: 'recall', title: 'recall._', section: 'postMeals' },
      props: true,
      beforeEnter: beforeRecall,
    },
    {
      path: '/:surveyId/recall/submission/:questionId?',
      name: 'recall-submission',
      component: views.recall.flow,

      meta: { module: 'recall', title: 'recall._', section: 'submission' },
      props: true,
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
