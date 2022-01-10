import { UserPayload } from '@intake24/survey/types/auth';
import { UserState } from '@intake24/survey/types/vuex';

const state = (): UserState => ({
  status: '',
  profile: {} as UserPayload,
});

export default state;
