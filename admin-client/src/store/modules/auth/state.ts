import { AuthState } from '@/types/vuex';

const state = (): AuthState => ({
  accessToken: null,
  mfa: null,
  status: '',
  error: {},
});

export default state;
