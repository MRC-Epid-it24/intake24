import type { UnwrapRef } from 'vue';
import { defineComponent, reactive } from 'vue';

export function createPromptHandlerNoStoreMixin<T extends object>() {
  return defineComponent({
    data() {
      return {
        currentState: null as T | null,
        continueEnabled: false,
      };
    },

    computed: {
      currentStateNotNull(): T {
        if (this.currentState === null) throw new Error('Current state is null');
        return this.currentState as T;
      },
    },

    mounted() {
      const initialState = this.getInitialState();
      this.currentState = reactive(initialState) as UnwrapRef<T>;

      const initialStateValid = this.isValid(initialState);
      this.setValidationState(initialStateValid);
      this.continueEnabled = initialStateValid;
    },

    methods: {
      onUpdate(newState: T): void {
        this.currentState = reactive(newState) as UnwrapRef<T>; // https://github.com/vuejs/core/issues/2136

        const newStateValid = this.isValid(newState);
        this.continueEnabled = newStateValid;
        this.setValidationState(newStateValid);
      },

      setValidationState(valid: boolean) {
        this.continueEnabled = valid;
        this.$emit('validation-update', valid);
      },

      getInitialState(): T {
        throw new Error('getInitialState method must be defined in the main component');
      },

      isValid(state: T | null): boolean {
        throw new Error('isValid method must be defined in the main component');
      },
    },
  });
}
