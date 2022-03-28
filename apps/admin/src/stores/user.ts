import { defineStore } from 'pinia';
import { Permission } from '@intake24/ui/types';
import http from '@intake24/admin/services/http.service';
import { AdminUserProfileResponse } from '@intake24/common/types/http/admin';
import { useLoading } from './loading';
import { useResource } from '.';

export interface UserState {
  status: string;
  profile: {
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

      const { resource, action } = permission;
      const { name } = useResource();
      return this.permissions.includes(`${resource ?? name}|${action}`);
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
