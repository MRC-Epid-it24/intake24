import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompt, Prompts } from '@intake24/common/prompts';
import type { EncodedFood, FoodState, MealState } from '@intake24/common/types';
import { useFoodUtils, useLocale, useMealUtils } from '@intake24/survey/composables';
import { promptType } from '@intake24/survey/util';

import { Next } from './actions';
import { BaseLayout, CardLayout } from './layouts';

export default <P extends keyof Prompts, F extends FoodState = EncodedFood>() =>
  defineComponent({
    name: 'BasePrompt',

    components: { Next, BaseLayout, CardLayout },

    props: {
      food: {
        type: Object as PropType<F>,
      },
      meal: {
        type: Object as PropType<MealState>,
      },
      prompt: {
        type: Object as PropType<Prompts[P]>,
        required: true,
      },
    },

    emits: ['action'],

    setup(props) {
      const { getLocaleContent } = useLocale();
      const { foodName } = useFoodUtils<FoodState | undefined>(props.food as FoodState | undefined);
      const { mealName } = useMealUtils(props.meal);

      return { foodName, getLocaleContent, mealName };
    },

    data() {
      return {
        errors: [] as string[],
      };
    },

    computed: {
      hasErrors(): boolean {
        return !!this.errors.length;
      },

      isFood() {
        return !!this.food;
      },

      isMeal() {
        return !!this.meal;
      },

      foodOrMealName() {
        return this.mealName ?? this.foodName ?? '';
      },

      isValid(): boolean {
        return false;
      },

      type() {
        return promptType((this.prompt as Prompt).component);
      },
    },

    methods: {
      clearErrors() {
        this.errors = [];
      },

      confirm() {
        // to be implemented by components
        return true;
      },

      action(type: string, id?: string) {
        if (type !== 'next') {
          this.$emit('action', type, id);
          return;
        }

        if (!this.confirm()) return;

        this.$emit('action', type, id);
      },
    },
  });
