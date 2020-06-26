import { AuthState } from '@/types/vuex';
import tokenSvc from '@/services/token.service';

const state = (): AuthState => ({
  accessToken: tokenSvc.getAccessToken(),
  mfa: null,
  status: '',
  error: {},
});

export default state;
