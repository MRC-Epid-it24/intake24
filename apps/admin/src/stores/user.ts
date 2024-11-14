import { defineStore } from 'pinia';

import { httpService } from '@intake24/admin/services';
import type { AdminTokenPayload, Subject } from '@intake24/common/security';
import type { AdminUserProfileResponse } from '@intake24/common/types/http/admin';
import { tokenService } from '@intake24/ui/services';
import type { Permission } from '@intake24/ui/types';

import { useResource } from './resource';

export interface UserState {
  payload: {
    userId: string;
    subject: Subject;
  } | null;
  profile: AdminUserProfileResponse['profile'] | null;
  permissions: AdminUserProfileResponse['permissions'];
  roles: AdminUserProfileResponse['roles'];
}

export const useUser = defineStore('user', {
  state: (): UserState => ({
    payload: null,
    profile: null,
    permissions: [],
    roles: [],
  }),
  getters: {
    isVerified: state => !!state.profile?.verifiedAt,
    loaded: state => !!state.profile,
  },
  actions: {
    can(permission: string | string[] | Permission, strict = false) {
      if (!this.isVerified)
        return false;

      if (typeof permission === 'string')
        return this.permissions.includes(permission);

      if (Array.isArray(permission)) {
        return strict
          ? permission.every(item => this.permissions.includes(item))
          : permission.some(item => this.permissions.includes(item));
      }

      const { name } = useResource();
      const { resource = name, action, ownerId, securables = [] } = permission;

      if (resource.startsWith('user.'))
        return true;

      if (action) {
        if (this.permissions.includes(`${resource}:${action}`))
          return true;

        if (securables.length && !!securables.find(securable => securable.action === action))
          return true;
      }

      if (ownerId && ownerId === this.profile?.id)
        return true;

      return false;
    },

    async request() {
      const {
        data: { profile, permissions, roles },
      } = await httpService.get<AdminUserProfileResponse>('admin/user', { withLoading: true });

      this.profile = { ...profile };
      this.permissions = [...permissions];
      this.roles = [...roles];
    },

    loadPayload(accessToken: string) {
      const { userId, sub } = tokenService.decodeAccessToken<AdminTokenPayload>(
        accessToken,
        'admin',
      );

      const subject: Subject = JSON.parse(atob(sub));

      this.payload = { userId, subject };
    },
  },
});

export type UserStoreDef = typeof useUser;

export type UserStore = ReturnType<UserStoreDef>;
