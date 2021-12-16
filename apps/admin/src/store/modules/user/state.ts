import { UserState } from '@/types';

const state = (): UserState => ({
  status: '',
  profile: null,
  permissions: [],
  roles: [],
});

export default state;
