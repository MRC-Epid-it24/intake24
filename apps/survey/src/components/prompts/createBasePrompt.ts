import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompt, Prompts } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
import type { EncodedFood, FoodState, MealState } from '@intake24/common/types';
import { useI18n } from '@intake24/i18n';
import { useFoodUtils, useMealUtils } from '@intake24/survey/composables';
import { promptType } from '@intake24/ui';

import { Next, NextMobile } from './actions';
import { BaseLayout, CardLayout } from './layouts';

export default <P extends keyof Prompts, F extends FoodState = EncodedFood>() =>
  defineComponent({
    name: 'BasePrompt',

    components: { Next, NextMobile, BaseLayout, CardLayout },

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
      section: {
        type: String as PropType<PromptSection>,
        required: true,
      },
    },

    emits: ['action'],

    setup(props) {
      const { translate } = useI18n();
      const { foodName } = useFoodUtils(props);
      const { mealName } = useMealUtils(props);

      return { foodName, translate, mealName };
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
        return !!this.food && !!this.meal;
      },

      isMeal() {
        return !!this.meal && !this.food;
      },

      foodOrMealName() {
        return this.foodName ?? this.mealName ?? '';
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

      action(type: string, ...args: [id?: string, params?: object]) {
        if (type !== 'next') {
          this.$emit('action', type, ...args);
          return;
        }

        if (!this.confirm()) return;

        this.$emit('action', type, ...args);
      },
    },
  });
