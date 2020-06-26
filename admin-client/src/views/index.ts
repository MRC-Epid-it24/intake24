import { ViewsCollection } from '@/types/vue-router';
import authentication from './authentication';
import dashboard from './Dashboard.vue';
import profile from './Profile.vue';
import schemes from './schemes';
import surveys from './surveys';
import users from './users';

const views: ViewsCollection = {
  authentication,
  dashboard,
  profile,
  schemes,
  surveys,
  users,
};

export default views;
