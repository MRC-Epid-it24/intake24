import type { StoreDefinition } from 'pinia';
import { defineStore } from 'pinia';
import type { ComponentType } from '@intake24/common/prompts';
import type { UnwrapRef } from 'vue';
import Vue, { defineComponent, reactive, unref } from 'vue';
import { size } from 'lodash';

interface FoodOrMealPromptsState<T> {
  prompts: {
    [key: number]: { [key: string]: T };
  };
}

const stores = new Map<ComponentType, StoreDefinition>();

function getOrCreatePromptStateStore<T extends object>(promptType: ComponentType): StoreDefinition {
  let storeDef = stores.get(promptType);

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
          Vue.delete(this.prompts[foodOrMealId], promptId);
          this.prompts = Object.fromEntries(
            Object.entries(this.prompts).filter((e) => Object.keys(e[1]).length !== 0)
          );
          // Don't clog local storage with empty entries
          if (size(this.prompts) === 0) localStorage.removeItem(storageKey);
        },
      },
    });

    stores.set(promptType, storeDef);
  }

  return storeDef;
}

export function createPromptHandlerStoreMixin<T extends object>(promptType: ComponentType) {
  return defineComponent({
    props: {
      promptId: {
        type: String,
        required: true,
      },
    },

    data() {
      const storeDef = getOrCreatePromptStateStore<T>(promptType);

      return {
        continueEnabled: false,
        // these fields should never be null, but there is no way to initialize
        // them correctly because methods are not available in data()
        initialState: null as T | null,
        currentState: null as T | null,
        stateStore: storeDef(),
      };
    },

    created() {
      // store definition function erases types
      const storedState = this.stateStore.prompts[this.getFoodOrMealId()]?.[this.promptId] as T;

      // reactive does not work well with generic types, see https://github.com/vuejs/core/issues/2136
      this.initialState = reactive(storedState ?? this.getInitialState()) as UnwrapRef<T>;
      this.currentState = this.initialState;
    },

    mounted() {
      // There seems to be no way to convert a reactive proxy back to a plain JS object,
      // this type cast is not correct but will work in this case

      const initialStateValid = this.isValid(this.initialState as T);
      this.setValidationState(initialStateValid);
      this.continueEnabled = initialStateValid;
    },

    computed: {
      initialStateNotNull(): T {
        if (this.initialState === null) throw new Error('Initial state is null');
        return this.initialState as T;
      },

      currentStateNotNull(): T {
        if (this.currentState === null) throw new Error('Current state is null');
        return this.currentState as T;
      },
    },

    methods: {
      onUpdate(newState: T): void {
        this.stateStore.updateState(this.getFoodOrMealId(), this.promptId, newState);
        this.currentState = reactive(newState) as UnwrapRef<T>; // https://github.com/vuejs/core/issues/2136

        const newStateValid = this.isValid(newState);
        this.continueEnabled = newStateValid;
        this.setValidationState(newStateValid);
      },

      getInitialState(): T {
        throw new Error('getInitialState method must be defined in the main component');
      },

      getFoodOrMealId(): number {
        throw new Error('getFoodOrMealId method must be defined in the main component');
      },

      isValid(state: T | null): boolean {
        throw new Error('isValid method must be defined in the main component');
      },

      setValidationState(valid: boolean) {
        this.continueEnabled = valid;
        this.$emit('validation-update', valid);
      },

      // Should be called after commitAnswer
      clearStoredState(): void {
        this.stateStore.clearState(this.getFoodOrMealId(), this.promptId);
      },
    },
  });
}
