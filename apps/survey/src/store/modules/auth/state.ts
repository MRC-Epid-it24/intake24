import { AuthState } from '@intake24/survey/types/vuex';

const state = (): AuthState => ({
  accessToken: null,
  status: '',
  error: null,
});

export default state;
