import type { StoreDefinition } from 'pinia';
import { defineStore } from 'pinia';
import Vue from 'vue';

import type { ComponentType } from '@intake24/common/prompts';

interface FoodOrMealPromptsState<T> {
  prompts: {
    [key: string]: { [key: string]: T };
  };
}

export const promptStores = new Map<ComponentType, StoreDefinition>();

function storageKey(promptType: ComponentType): string {
  return `${import.meta.env.VITE_APP_PREFIX ?? ''}${promptType}-state`;
}

export function clearPromptStores(): void {
  for (const [promptType, storeDef] of promptStores) {
    storeDef().$dispose();
    localStorage.removeItem(storageKey(promptType));
  }
  promptStores.clear();
}

export function getOrCreatePromptStateStore<T extends object>(
  promptType: ComponentType
): StoreDefinition {
  let storeDef = promptStores.get(promptType);

  if (storeDef === undefined) {
    const storageKey = `${import.meta.env.VITE_APP_PREFIX ?? ''}${promptType}-state`;

    storeDef = defineStore(`${promptType}-state`, {
      state: (): FoodOrMealPromptsState<T> => ({
        prompts: {},
      }),
      persist: {
        key: storageKey,
      },
      actions: {
        updateState(foodOrMealId: string, promptId: string, data: T) {
          this.prompts = {
            ...this.prompts,
            [foodOrMealId]: { ...this.prompts[foodOrMealId], [promptId]: data },
          };
        },
        clearState(foodOrMealId: string, promptId: string) {
          if (this.prompts[foodOrMealId]?.[promptId])
            Vue.delete(this.prompts[foodOrMealId], promptId);

          this.prompts = Object.fromEntries(
            Object.entries(this.prompts).filter((e) => Object.keys(e[1]).length !== 0)
          );

          // Dispose store if it is empty
          if (!Object.keys(this.prompts).length) {
            this.$dispose();
            promptStores.delete(promptType);
            localStorage.removeItem(storageKey);
          }
        },
      },
    });

    promptStores.set(promptType, storeDef);
  }

  return storeDef;
}
