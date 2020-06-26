import { AuthState } from '@/types/vuex';
import tokenSvc from '@/services/token.service';

const state = (): AuthState => ({
  accessToken: tokenSvc.getAccessToken(),
  status: '',
  error: {},
});

export default state;
