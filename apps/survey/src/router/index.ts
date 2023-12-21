import type { RouteConfig } from 'vue-router';
import Vue from 'vue';
import VueRouter from 'vue-router';

import views from '@intake24/survey/views';

import {
  authGuard,
  createUserGuard,
  feedbackParametersGuard,
  globalGuard,
  surveyParametersErrorGuard,
  surveyParametersGuard,
} from './guards';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'home',
    component: views.home,
    meta: { module: 'login', title: 'common._' },
  },
  {
    path: '/a/:token',
    name: 'authentication',
    meta: { module: 'login', title: 'common.login._' },
    beforeEnter: authGuard,
  },
  {
    path: '/:surveyId',
    name: 'survey-login',
    component: views.survey.login,
    meta: { module: 'login', title: 'common.login._' },
    props: true,
  },
  {
    path: '/:surveyId/challenge',
    name: 'survey-challenge',
    component: views.survey.challenge,
    meta: { module: 'login', title: 'common.login._' },
    props: true,
  },
  {
    path: '/:surveyId/generate-user',
    name: 'survey-generate-user',
    component: views.survey.generateUser,
    meta: { module: 'public', title: 'common.login._' },
    props: true,
  },
  {
    path: '/:surveyId/create-user/:token',
    name: 'survey-create-user',
    meta: { module: 'public' },
    beforeEnter: createUserGuard,
  },
  {
    path: '/:surveyId/home',
    name: 'survey-home',
    component: views.survey.home,
    meta: { module: 'survey', title: 'recall._' },
    beforeEnter: surveyParametersGuard,
    props: true,
  },
  {
    path: '/:surveyId/profile',
    name: 'survey-profile',
    component: views.survey.profile,
    meta: { module: 'survey', title: 'profile._' },
    beforeEnter: surveyParametersGuard,
    props: true,
  },
  {
    path: '/:surveyId/recall',
    name: 'survey-recall',
    component: views.survey.recall,
    meta: { module: 'survey', title: 'recall._' },
    beforeEnter: surveyParametersGuard,
    props: true,
  },
  {
    path: '/:surveyId/error',
    name: 'survey-error',
    component: views.survey.error,
    meta: { module: 'survey', title: 'recall._' },
    beforeEnter: surveyParametersErrorGuard,
    props: true,
  },
  // Feedback
  {
    path: '/:surveyId/feedback',
    name: 'feedback-home',
    component: views.feedback.home,
    meta: { module: 'feedback', title: 'feedback._' },
    beforeEnter: feedbackParametersGuard,
    props: true,
  },
  {
    path: '/:surveyId/feedback/error',
    name: 'feedback-error',
    component: views.survey.error,
    meta: { module: 'feedback', title: 'feedback._' },
    beforeEnter: surveyParametersErrorGuard,
    props: true,
  },
  {
    path: '/:surveyId/feedback/physical-data',
    name: 'feedback-physical-data',
    component: views.feedback.physicalData,
    meta: { module: 'feedback', title: 'feedback._' },
    beforeEnter: feedbackParametersGuard,
    props: true,
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
  base: import.meta.env.VITE_APP_BASE_URL ?? '/',
  routes,
});

router.beforeEach(globalGuard);

export default router;
