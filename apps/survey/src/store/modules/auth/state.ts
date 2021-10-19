import { AuthState } from '@/types/vuex';

const state = (): AuthState => ({
  accessToken: null,
  status: '',
  error: null,
});

export default state;
