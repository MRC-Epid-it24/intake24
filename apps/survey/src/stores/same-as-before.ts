import { defineStore } from 'pinia';

import type { EncodedFood } from '@intake24/common/types';

import { useUser } from './user';

export type SameAsBeforeItem = {
  food: EncodedFood;
  localeId: string;
};

export interface SameAsBeforeState {
  items: {
    [userId: string]: {
      [foodCode: string]: SameAsBeforeItem;
    };
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
      if (!item || item.localeId !== localeId) return undefined;

      return item;
    },

    saveItem(localeId: string, food: EncodedFood) {
      const { userId } = useUser();
      if (!userId) return;

      if (!this.items[userId]) this.items[userId] = {};

      console.log('Saving same as before item', food.data.code);

      this.items[userId][food.data.code] = { food, localeId };
    },
  },
});

export type SameAsBeforeStoreDef = typeof useSameAsBefore;

export type SameAsBeforeStore = ReturnType<SameAsBeforeStoreDef>;
