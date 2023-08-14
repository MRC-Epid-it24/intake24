import { defineStore } from 'pinia';

import type { EncodedFood } from '@intake24/common/types';

import { useUser } from './user';

export type SameAsBeforeItem = {
  food: EncodedFood;
  localeId: string;
  createdAt: number;
};

export interface SameAsBeforeState {
  items: {
    [userId: string]:
      | {
          [foodCode: string]: SameAsBeforeItem | undefined;
        }
      | undefined;
  };
}

export const useSameAsBefore = defineStore('same-as-before', {
  state: (): SameAsBeforeState => ({ items: {} }),
  persist: {
    key: `${import.meta.env.VITE_APP_PREFIX ?? ''}same-as-before`,
  },
  actions: {
    getItem(localeId: string, foodCode: string) {
      const { userId } = useUser();
      if (!userId) return undefined;

      const item = this.items[userId]?.[foodCode];
      if (item?.localeId !== localeId) return undefined;

      if (item.food.data.sameAsBeforeOption) return item;

      this.removeItem(foodCode);
      return undefined;
    },

    removeItem(foodCode: string) {
      const { userId } = useUser();
      if (!userId) return undefined;

      const { [foodCode]: remove, ...rest } = this.items[userId] ?? {};
      this.items = { ...this.items, [userId]: { ...rest } };
    },

    saveItem(localeId: string, food: EncodedFood) {
      const { userId } = useUser();
      if (!userId) return;

      if (!food.data.sameAsBeforeOption) return;

      if (!this.items[userId]) this.items[userId] = {};

      this.items[userId]![food.data.code] = { food, localeId, createdAt: Date.now() };
    },
  },
});

export type SameAsBeforeStoreDef = typeof useSameAsBefore;

export type SameAsBeforeStore = ReturnType<SameAsBeforeStoreDef>;
