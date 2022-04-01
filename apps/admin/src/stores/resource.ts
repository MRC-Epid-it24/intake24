import Vue from 'vue';
import { defineStore } from 'pinia';
import http from '@intake24/admin/services/http.service';
import { Dictionary } from '@intake24/common/types';
import { AxiosError } from 'axios';
import { useLoading } from '@intake24/ui/stores';

export const FILTER_LS_KEY = 'filter';

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
    filter: Vue.ls.get(FILTER_LS_KEY, {}),
    error: null,
  }),
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
        const { data } = await http.get(`${name}/refs`, { withErr: true });
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
      Vue.ls.set(FILTER_LS_KEY, this.filter, 24 * 60 * 60 * 1000);
    },

    async resetFilter() {
      const { [this.name]: remove, ...rest } = this.filter;

      this.filter = { ...rest };
      Vue.ls.set(FILTER_LS_KEY, this.filter, 24 * 60 * 60 * 1000);
    },
  },
});
