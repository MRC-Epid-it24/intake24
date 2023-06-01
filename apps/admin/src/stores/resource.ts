import { defineStore } from 'pinia';

import type { Dictionary } from '@intake24/common/types';

export type ListState = {
  name: string;
  api: string;
  filter: Dictionary;
};

export const useResource = defineStore('resource', {
  state: (): ListState => ({
    name: 'dashboard',
    api: 'admin/dashboard',
    filter: {},
  }),
  persist: {
    key: `${import.meta.env.VITE_APP_PREFIX ?? ''}resource`,
    paths: ['filter'],
  },
  getters: {
    getFilter: (state): Dictionary => {
      const { name } = state;
      return (name && state.filter[name]) ?? {};
    },
  },
  actions: {
    update({ name, api }: { name: string; api: string }) {
      this.name = name;
      this.api = api;
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
