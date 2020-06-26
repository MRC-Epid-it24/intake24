import tokenSvc from '@/services/token.service';
import { UserPayload } from '@/types/auth';
import { UserState } from '@/types/vuex';

const state = (): UserState => ({
  status: '',
  profile: tokenSvc.decodeAccessToken() ?? ({} as UserPayload),
});

export default state;
