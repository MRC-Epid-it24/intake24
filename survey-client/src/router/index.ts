import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import GenerateUser from '@/views/GenerateUser.vue';
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import Recall from '@/views/Recall.vue';
import Feedback from '@/views/Feedback.vue';

// Temporary route for testing portion size code before foods & meals are loaded
import PortionTest from '@/views/PortionTest.vue';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { module: 'public', title: 'common._' },
  },
  {
    path: '/:surveyId',
    name: 'login',
    component: Login,
    meta: { module: 'login', title: 'login._' },
  },
  
  // Temporary route for testing portion size code before foods & meals are loaded
  {
    path: '/:surveyId/portionTest',
    name: 'portion-test',
    component: PortionTest,
    meta: { module: 'public', title: 'portionTest._' },
  },

  {
    path: '/:surveyId/generate-user',
    name: 'generate-user',
    component: GenerateUser,
    meta: { module: 'public', title: 'login._' },
  },
  {
    path: '/:surveyId/recall',
    name: 'recall',
    component: Recall,
    meta: { module: 'recall', title: 'recall._' },
  },
  {
    path: '/:surveyId/feedback',
    name: 'feedback',
    component: Feedback,
    meta: { module: 'feedback', title: 'feedback._' },
  },
  {
    path: '/:surveyId/:token',
    name: 'token',
    component: Login,
    meta: { module: 'login', title: 'login._' },
  },

  
  // Catch any unmatched routes
  {
    path: '*',
    name: '404',
    component: Home,
    meta: { module: 'public', title: 'common._' },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.VUE_APP_BASE_URL ?? '/',
  routes,
});

export default router;
