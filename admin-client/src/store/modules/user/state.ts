import { UserState } from '@/types/vuex';

const state = (): UserState => ({
  status: '',
  profile: {},
  permissions: [],
  roles: [],
});

export default state;
