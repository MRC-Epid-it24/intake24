import { defineStore } from 'pinia';

export type LoadingState = {
  items: string[];
};

export const useLoading = defineStore('loading', {
  state: (): LoadingState => ({ items: [] }),
  getters: {
    isLoading: (state) => !!state.items.length,
  },
  actions: {
    addItem(item: string) {
      this.items.push(item);
    },
    removeItem(item: string) {
      this.items = this.items.filter((i) => i !== item);
    },
    reset() {
      this.$reset();
    },
  },
});

export type LoadingStoreDef = typeof useLoading;

export type LoadingStore = ReturnType<LoadingStoreDef>;
