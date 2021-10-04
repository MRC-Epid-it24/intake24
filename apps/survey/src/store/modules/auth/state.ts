import { AuthState } from '@/types/vuex';

const state = (): AuthState => ({
  accessToken: null,
  status: '',
  error: {},
});

export default state;
