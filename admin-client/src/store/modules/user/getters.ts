import { GetterTree } from 'vuex';
import { Permission, RootState, UserState } from '@/types/vuex';

const getters: GetterTree<UserState, RootState> = {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  can: (state, getters, rootState) => (
    permission: string | string[] | Permission,
    strict = false
  ) => {
    if (typeof permission === 'string') return getters.permissions.includes(permission);

    if (Array.isArray(permission)) {
      return strict
        ? permission.every((item) => getters.permissions.includes(item))
        : permission.some((item) => getters.permissions.includes(item));
    }

    const { module, action } = permission;
    return getters.permissions.includes(`${module ?? rootState.module}-${action}`);
  },
  loaded: (state) => !!Object.keys(state.profile).length,
  profile: (state) => state.profile,
  permissions: (state) => state.permissions,
  roles: (state) => state.roles,
};

export default getters;
