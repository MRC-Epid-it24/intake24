import { UserState } from '@/types';

const state = (): UserState => ({
  status: '',
  profile: {},
  permissions: [],
  roles: [],
});

export default state;
