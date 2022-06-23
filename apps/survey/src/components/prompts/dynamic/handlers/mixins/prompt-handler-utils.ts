import { reactive } from '@vue/composition-api';
import { defineStore, StoreDefinition } from 'pinia';
import Vue, { VueConstructor } from 'vue';
import { ComponentType } from '@intake24/common/prompts';

export interface PromptHandlerUtils<T> {
  getStoredState(foodOrMealId: number, promptId: string): T | undefined;

  updateStoredState(foodOrMealId: number, promptId: string, newValue: T): void;

  clearStoredState(foodOrMealId: number, promptId: string): void;

  complete(): void;
}

interface FoodOrMealPromptsState<T> {
  prompts: {
    [key: number]: { [key: string]: T };
  };
}

const stores = new Map<ComponentType, StoreDefinition>();

function getOrCreatePromptStateStore<T extends object>(promptType: ComponentType): StoreDefinition {
  let storeDef = stores.get(promptType);

  if (storeDef === undefined) {
    storeDef = defineStore(`${promptType}-state`, {
      state: (): FoodOrMealPromptsState<T> => ({
        prompts: {},
      }),
      persist: {
        key: `${import.meta.env.VITE_APP_PREFIX ?? ''}${promptType}-state`,
      },
      actions: {
        updateState(foodOrMealId: number, promptId: string, data: T) {
          this.prompts = {
            ...this.prompts,
            [foodOrMealId]: {
              ...this.prompts[foodOrMealId],
              [promptId]: reactive(data),
            },
          };
        },
        clearState(foodOrMealId: number, promptId: string) {
          Vue.delete(this.prompts[foodOrMealId], promptId);
          this.prompts = Object.fromEntries(
            Object.entries(this.prompts).filter((e) => Object.keys(e[1]).length !== 0)
          );
        },
      },
    });

    stores.set(promptType, storeDef);
  }

  return storeDef;
}

export function createPromptHandlerMixin<T extends object>(
  promptType: ComponentType
): VueConstructor<Vue & PromptHandlerUtils<T>> {
  return (Vue as VueConstructor<Vue & PromptHandlerUtils<T>>).extend({
    data() {
      const storeDef = getOrCreatePromptStateStore<T>(promptType);

      return {
        store: storeDef(),
      };
    },

    methods: {
      updateStoredState(foodOrMealId: number, promptId: string, data: T) {
        this.store.updateState(foodOrMealId, promptId, data);
      },

      getStoredState(foodOrMealId: number, promptId: string): T | undefined {
        return this.store.prompts[foodOrMealId]?.[promptId];
      },

      clearStoredState(foodOrMealId: number, promptId: string) {
        this.store.clearState(foodOrMealId, promptId);
      },
    },
  });
}
