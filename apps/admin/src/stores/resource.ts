import type { AxiosError } from 'axios';
import { defineStore } from 'pinia';

import type { Dictionary } from '@intake24/common/types';
import { httpService } from '@intake24/admin/services';
import { useLoading } from '@intake24/ui/stores';

export type ListState = {
  name: string;
  api: string;
  refs: Dictionary;
  filter: Dictionary;
  error: AxiosError | null;
};

export const useResource = defineStore('resource', {
  state: (): ListState => ({
    name: 'dashboard',
    api: 'admin/dashboard',
    refs: {},
    filter: {},
    error: null,
  }),
  persist: {
    key: `${import.meta.env.VITE_APP_PREFIX ?? ''}resource`,
    paths: ['filter'],
  },
  getters: {
    getFilter: (state) => {
      const { name } = state;
      return (name && state.filter[name]) ?? {};
    },
  },
  actions: {
    update({ name, api }: { name: string; api: string }) {
      this.name = name;
      this.api = api;
    },

    async request() {
      const { name } = this;
      const loading = useLoading();
      loading.addItem(`${name}/refs`);

      try {
        const { data } = await httpService.get(`${name}/refs`);
        this.refs = data;
      } catch (err: any) {
        this.error = err;
      } finally {
        loading.removeItem(`${name}/refs`);
      }
    },

    async setFilter(filter: Dictionary) {
      this.filter = {
        ...this.filter,
        [this.name]: filter,
      };
    },

    async resetFilter() {
      const { [this.name]: remove, ...rest } = this.filter;

      this.filter = { ...rest };
    },
  },
});

export type ResourceStoreDef = typeof useResource;

export type ResourceStore = ReturnType<ResourceStoreDef>;
