import { AuthState } from '@/types';

const state = (): AuthState => ({
  accessToken: null,
  mfa: null,
  status: '',
  error: null,
});

export default state;
