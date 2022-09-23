import type { UnwrapRef } from 'vue';
import { defineComponent, reactive } from 'vue';

import type { ComponentType } from '@intake24/common/prompts';
import { getOrCreatePromptStateStore } from '@intake24/survey/stores';

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
