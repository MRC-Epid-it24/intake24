import { defineStore } from 'pinia';
import type { Permission } from '@intake24/ui/types';
import http from '@intake24/admin/services/http.service';
import type { AdminUserProfileResponse } from '@intake24/common/types/http/admin';
import { useLoading } from '@intake24/ui/stores';
import { useResource } from './resource';

export interface UserState {
  status: string;
  profile: {
    id: string;
    email: string | null;
    name: string | null;
    phone: string | null;
  } | null;
  permissions: string[];
  roles: string[];
}

export const useUser = defineStore('user', {
  state: (): UserState => ({
    status: '',
    profile: null,
    permissions: [],
    roles: [],
  }),
  getters: {
    loaded: (state) => !!state.profile,
  },
  actions: {
    can(permission: string | string[] | Permission, strict = false) {
      if (typeof permission === 'string') return this.permissions.includes(permission);

      if (Array.isArray(permission)) {
        return strict
          ? permission.every((item) => this.permissions.includes(item))
          : permission.some((item) => this.permissions.includes(item));
      }

      const { name } = useResource();
      const { resource = name, action, ownerId, securables = [] } = permission;

      if (action) {
        if (this.permissions.includes(`${resource}|${action}`)) return true;

        if (securables.length && !!securables.find((securable) => securable.action === action))
          return true;
      }

      if (ownerId && ownerId === this.profile?.id) return true;

      return false;
    },
    async request() {
      this.status = 'loading';
      const loading = useLoading();
      loading.addItem('user');

      try {
        const {
          data: { profile, permissions, roles },
        } = await http.get<AdminUserProfileResponse>('admin/user');

        this.profile = { ...profile };
        this.permissions = [...permissions];
        this.roles = [...roles];
        this.status = 'success';

        Promise.resolve();
      } catch (err: any) {
        this.status = 'error';
        Promise.reject(err);
      } finally {
        loading.removeItem('user');
      }
    },
  },
});
