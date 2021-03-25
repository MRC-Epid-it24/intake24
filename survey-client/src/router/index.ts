import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import views from '@/views';

// Temporary route for testing portion size code before foods & meals are loaded
import PortionTest from '@/views/PortionTest.vue';

Vue.use(VueRouter);

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
  },
  {
    path: '/:surveyId/recall/pre-meals/:questionId',
    name: 'recall-preMeals',
    component: views.recall,
    meta: { module: 'recall', title: 'recall._', section: 'preMeals' },
  },
  {
    path: '/:surveyId/recall/post-meals/:questionId',
    name: 'recall-postMeals',
    component: views.recall,
    meta: { module: 'recall', title: 'recall._', section: 'postMeals' },
  },
  {
    path: '/:surveyId/recall/submission/:questionId',
    name: 'recall-submission',
    component: views.recall,
    meta: { module: 'recall', title: 'recall._', section: 'submission' },
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

export default router;
