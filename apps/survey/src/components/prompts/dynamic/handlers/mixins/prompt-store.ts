import type { StoreDefinition } from 'pinia';
import { defineStore } from 'pinia';
import type { ComponentType } from '@intake24/common/prompts';
import Vue, { defineComponent } from 'vue';

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
              [promptId]: data,
            },
          };
        },
        clearState(foodOrMealId: number, promptId: string) {
          console.log('CLEAR STATE');
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

export function createPromptStoreMixin<T extends object>(promptType: ComponentType) {
  return defineComponent({
    data() {
      const storeDef = getOrCreatePromptStateStore<T>(promptType);

      return {
        continueEnabled: false,
        initialStateInternal: null as T | null,
        stateStore: storeDef(),
      };
    },

    computed: {
      initialState(): T | null {
        return this.initialStateInternal as T | null;
      },
    },

    methods: {
      updateStoredState(foodOrMealId: number, promptId: string, data: T) {
        this.stateStore.updateState(foodOrMealId, promptId, data);
      },

      loadInitialState(foodOrMealId: number, promptId: string, defaultValue: T): void {
        const storedState = this.stateStore.prompts[foodOrMealId]?.[promptId];

        this.initialStateInternal = storedState ?? defaultValue;
      },

      clearStoredState(foodOrMealId: number, promptId: string) {
        this.stateStore.clearState(foodOrMealId, promptId);
      },

      setValidationState(valid: boolean) {
        this.continueEnabled = valid;
        this.$emit('validation-update', valid);
      },
    },
  });
}
