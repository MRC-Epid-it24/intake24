/* eslint-disable @typescript-eslint/no-shadow */
import { GetterTree } from 'vuex';
import { Permission, RootState, UserState } from '@intake24/admin/types';

const getters: GetterTree<UserState, RootState> = {
  can:
    (state, getters, rootState, rootGetters) =>
    (permission: string | string[] | Permission, strict = false) => {
      if (typeof permission === 'string') return getters.permissions.includes(permission);

      if (Array.isArray(permission)) {
        return strict
          ? permission.every((item) => getters.permissions.includes(item))
          : permission.some((item) => getters.permissions.includes(item));
      }

      const { resource, action } = permission;
      return getters.permissions.includes(`${resource ?? rootGetters['resource/name']}-${action}`);
    },
  loaded: (state) => !!state.profile,
  profile: (state) => state.profile,
  permissions: (state) => state.permissions,
  roles: (state) => state.roles,
};

export default getters;
