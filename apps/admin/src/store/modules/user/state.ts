import { UserState } from '@intake24/admin/types';

const state = (): UserState => ({
  status: '',
  profile: null,
  permissions: [],
  roles: [],
});

export default state;
