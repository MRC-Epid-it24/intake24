import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { ActionItem, Prompt } from '@intake24/common/prompts';
import type { Dictionary, FoodState, MealState } from '@intake24/common/types';
import { localeContent } from '@intake24/survey/components/mixins';
import { fromMealTime } from '@intake24/survey/stores/meal-food-utils';
import { promptType } from '@intake24/survey/util';

import { Next } from '../actions';

export default defineComponent({
  name: 'LayoutMixin',

  components: { Next },

  mixins: [localeContent],

  props: {
    prompt: {
      type: Object as PropType<Prompt>,
      required: true,
    },
    food: {
      type: Object as PropType<FoodState>,
    },
    meal: {
      type: Object as PropType<MealState>,
    },
    isValid: {
      type: Boolean,
      default: false,
    },
    navTab: {
      type: String,
      default: 'next',
    },
  },

  emits: ['action', 'update:navTab'],

  computed: {
    foodOrMealId() {
      return this.food?.id ?? this.meal?.id;
    },

    desktopActions(): ActionItem[] {
      return this.prompt.actions?.items.filter((action) => action.layout.includes('desktop')) ?? [];
    },

    hasDefaultSlot(): boolean {
      return !!this.$slots.default;
    },

    hasActionsSlot(): boolean {
      return !!this.$slots.actions;
    },

    mobileActions(): ActionItem[] {
      return this.prompt.actions?.items.filter((action) => action.layout.includes('mobile')) ?? [];
    },

    localeFoodName() {
      if (!this.food) return undefined;

      if (this.food.type === 'encoded-food') return this.getLocaleContent(this.food.data.localName);

      return this.food.description;
    },

    localeMealName() {
      return this.meal && this.getLocaleContent(this.meal.name);
    },

    mealTime() {
      return this.meal?.time ? fromMealTime(this.meal.time, true) : undefined;
    },

    localeText(): string {
      return this.getLocaleContent(this.prompt.i18n.text, {
        path: `prompts.${this.type}.text`,
        params: this.params,
      });
    },

    headerText(): string | undefined {
      if (this.localeText) return this.localeText;

      if (this.prompt.type !== 'custom') return undefined;

      if (this.localeFoodName) return this.localeFoodName;

      return this.localeMealName && this.mealTime
        ? `${this.localeMealName} (${this.mealTime})`
        : this.localeMealName;
    },

    localeDescription(): string | undefined {
      return this.getLocaleContent(this.prompt.i18n.description, {
        path: `prompts.${this.type}.description`,
        params: this.params,
      });
    },

    params(): Dictionary<string> {
      const params: Dictionary<string> = {};
      const { localeFoodName, localeMealName, mealTime } = this;

      if (localeFoodName) {
        params.item = localeFoodName;
        params.food = localeFoodName;
      }

      if (localeMealName) {
        params.mealName = localeMealName;

        if (mealTime) {
          params.mealTime = mealTime;

          const meal = `${localeMealName} (${mealTime})`;
          params.item = meal;
          params.meal = meal;
        } else {
          params.item = localeMealName;
          params.meal = localeMealName;
        }
      }

      return params;
    },

    type() {
      return promptType(this.prompt.component);
    },
  },

  methods: {
    update(type: string) {
      this.$emit('update:navTab', type);
    },

    action(type: string, id?: number) {
      this.update(type);
      this.$emit('action', type, id);
    },

    /*
     * probably redundant at this point since nav actions is being handled by click rather than watching the navTab prop
     * component -> nav -> is being rendered
     * TODO remove
     */
    next() {
      this.update('next');
      this.$emit('action', 'next');
    },
  },
});
