import tokenSvc from '@/services/token.service';
import { UserPayload } from '@/types/auth';
import { UserState } from '@/types/vuex';

const state = (): UserState => ({
  status: '',
  payload: tokenSvc.decodeAccessToken() ?? ({} as UserPayload),
  profile: {},
  permissions: [],
  roles: [],
});

export default state;
