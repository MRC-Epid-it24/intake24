import { Views } from '@/types/vue-router';
import Login from './Login.vue';
import PasswordRequest from './PasswordRequest.vue';
import PasswordReset from './PasswordReset.vue';

export default {
  login: Login,
  passwordRequest: PasswordRequest,
  passwordReset: PasswordReset,
} as Views;
