import { AuthState } from '@intake24/admin/types';

const state = (): AuthState => ({
  accessToken: null,
  mfaRequestUrl: null,
  error: null,
});

export default state;
