import { AuthState } from '@/types';

const state = (): AuthState => ({
  accessToken: null,
  mfa: null,
  status: '',
  error: {},
});

export default state;
