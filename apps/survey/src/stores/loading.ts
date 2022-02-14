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
    async addItem(item: string) {
      this.items.push(item);
    },
    async removeItem(item: string) {
      this.items = this.items.filter((i) => i !== item);
    },
    async reset() {
      this.$reset();
    },
  },
});
