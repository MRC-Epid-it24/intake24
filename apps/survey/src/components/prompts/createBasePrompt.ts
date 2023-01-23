import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompt, Prompts } from '@intake24/common/prompts';
import type { EncodedFood, FoodState, MealState } from '@intake24/common/types';
import { localeContent } from '@intake24/survey/components/mixins';
import { promptType } from '@intake24/survey/util';

import { Next } from './actions';
import { PromptLayout } from './layouts';

export default <P extends keyof Prompts, F extends FoodState = EncodedFood>() =>
  defineComponent({
    name: 'BasePrompt',

    components: { Next, PromptLayout },

    mixins: [localeContent],

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

      localeFoodName(): string | undefined {
        if (!this.food) return undefined;

        // temp ts-fix
        const food = this.food as FoodState;

        if (food.type === 'encoded-food') return this.getLocaleContent(food.data.localName);

        return food.description;
      },

      localeMealName() {
        return this.meal && this.getLocaleContent(this.meal.name);
      },

      foodOrMealName() {
        return this.localeMealName ?? this.localeFoodName ?? '';
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

      action(type: string, id?: number) {
        if (type !== 'next') {
          this.$emit('action', type, id);
          return;
        }

        if (!this.confirm()) return;

        this.$emit('action', type, id);
      },
    },
  });
