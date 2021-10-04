import { UserPayload } from '@/types/auth';
import { UserState } from '@/types/vuex';

const state = (): UserState => ({
  status: '',
  profile: {} as UserPayload,
});

export default state;
