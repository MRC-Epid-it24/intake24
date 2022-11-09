import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { EncodedFood, MealState } from '@intake24/common/types';
import { localeContent } from '@intake24/survey/components/mixins';

import { Continue } from './actions';
import { PromptLayout } from './layouts';

export default defineComponent({
  name: 'BasePrompt',

  components: { Continue, PromptLayout },

  mixins: [localeContent],

  props: {
    meal: {
      type: Object as PropType<MealState>,
    },
    food: {
      type: Object as PropType<EncodedFood>,
    },
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

    localeFoodName() {
      return this.food && this.getLocaleContent(this.food.data.englishName);
    },

    localeMealName() {
      return this.meal && this.getLocaleContent(this.meal.name);
    },

    foodOrMealName() {
      const name = this.localeMealName ?? this.localeFoodName;
      if (!name) throw new Error('No food or meal selected!');

      return name;
    },

    isValid(): boolean {
      return false;
    },
  },

  mounted() {
    this.$emit('update', { valid: this.isValid });
  },

  methods: {
    clearErrors() {
      this.errors = [];
    },
  },
});
