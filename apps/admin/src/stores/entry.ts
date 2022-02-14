import { defineStore } from 'pinia';
import { Dictionary } from '@intake24/common/types';
import axios, { AxiosError } from 'axios';
import { useLoading, useResource } from '.';
import http from '../services/http.service';

export type EntryState = {
  data: Dictionary;
  refs: Dictionary;
  error: AxiosError | null;
};

export const useEntry = defineStore('entry', {
  state: (): EntryState => ({
    data: {},
    refs: {},
    error: null,
  }),
  getters: {
    getEntry: <T>(state: EntryState): T => state.data as T,
    dataLoaded: (state) => !!Object.keys(state.data).length,
    getRefs: <T>(state: EntryState): T => state.refs as T,
    refsLoaded: (state) => !!Object.keys(state.refs).length,
  },
  actions: {
    async requestEntry({ id, query }: { id: string; query?: any }) {
      const { name, api } = useResource();
      const loading = useLoading();

      this.clearEntry();
      loading.addItem(`${name}/entry`);

      if (id === 'create') {
        this.initEntry();
        await this.requestRefs();
        loading.removeItem(`${name}/entry`);
        return;
      }

      try {
        const { data } = await http.get(`${api}/${id}`, { params: query });
        await this.updateEntry(data);
      } catch (err: any) {
        this.error = err;
      } finally {
        loading.removeItem(`${name}/entry`);
      }
    },

    async requestRefs() {
      const { name, api } = useResource();
      const loading = useLoading();

      this.clearRefs();
      loading.addItem(`${name}/entry/refs`);

      try {
        const { data } = await http.get(`${api}/refs`);
        this.updateRefs(data);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status !== 404) this.error = err;
      } finally {
        loading.removeItem(`${name}/entry/refs`);
      }
    },

    clearEntry() {
      this.data = {};
    },

    initEntry() {
      this.data = { ...{ id: null } };
    },

    async updateEntry(data?: Dictionary) {
      if (data) this.data = { ...(data ?? { id: null }) };

      await this.requestRefs();
    },

    clearRefs() {
      this.refs = {};
    },

    updateRefs(refs?: Dictionary) {
      if (refs) this.refs = { ...refs };
    },
  },
});
