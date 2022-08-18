import axios from 'axios';
import { defineStore } from 'pinia';

import type { Dictionary } from '@intake24/common/types';
import { useLoading } from '@intake24/ui/stores';

import http from '../services/http.service';
import { useResource } from './resource';

export type EntryState = {
  data: Dictionary;
  refs: Dictionary;
};

export const useEntry = defineStore('entry', {
  state: (): EntryState => ({
    data: {},
    refs: {},
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
        this.setEntry(data);
      } finally {
        loading.removeItem(`${name}/entry`);
      }

      await this.requestRefs();
    },

    async requestRefs() {
      const { name, api } = useResource();
      const loading = useLoading();

      this.clearRefs();
      loading.addItem(`${name}/refs`);

      try {
        const { data } = await http.get(`${api}/refs`);
        this.setRefs(data);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status !== 404) throw err;
      } finally {
        loading.removeItem(`${name}/refs`);
      }
    },

    clearEntry() {
      this.data = {};
    },

    initEntry() {
      this.data = { ...{ id: null } };
    },

    setEntry(data?: Dictionary) {
      if (data) this.data = { ...(data ?? { id: null }) };
    },

    updateEntry(data: Partial<Dictionary>) {
      this.data = { ...this.data, ...data };
    },

    clearRefs() {
      this.refs = {};
    },

    setRefs(refs?: Dictionary) {
      if (refs) this.refs = { ...refs };
    },
  },
});

export type EntryStoreDef = typeof useEntry;

export type EntryStore = ReturnType<EntryStoreDef>;
