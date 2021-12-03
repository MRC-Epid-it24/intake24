import { AuthState } from '@/types';

const state = (): AuthState => ({
  accessToken: null,
  mfaRequestUrl: null,
  error: null,
});

export default state;
