import type { PropType } from 'vue';
import { defineComponent, toRefs } from 'vue';

import type { ActionItem, Prompt } from '@intake24/common/prompts';
import type { Dictionary, FoodState, MealState } from '@intake24/common/types';
import { useFoodUtils, useLocale, useMealUtils } from '@intake24/survey/composables';
import { promptType } from '@intake24/ui/util';

import { Next } from '../actions';

export default defineComponent({
  name: 'LayoutMixin',

  components: { Next },

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

  setup(props) {
    const { food, meal } = toRefs(props);

    const { getLocaleContent } = useLocale();
    const { foodName } = useFoodUtils(food);
    const { mealName, mealTime, mealNameWithTime } = useMealUtils(meal);

    return { foodName, getLocaleContent, mealName, mealTime, mealNameWithTime };
  },

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

    localeText(): string {
      return this.getLocaleContent(this.prompt.i18n.text, {
        path: `prompts.${this.type}.text`,
        params: this.params,
      });
    },

    headerText(): string | undefined {
      if (this.localeText) return this.localeText;

      if (this.prompt.type !== 'custom') return undefined;

      if (this.foodName) return this.foodName;

      return this.mealNameWithTime;
    },

    localeDescription(): string | undefined {
      return this.getLocaleContent(this.prompt.i18n.description, {
        path: `prompts.${this.type}.description`,
        params: this.params,
      });
    },

    params(): Dictionary<string> {
      const params: Dictionary<string> = {};
      const { foodName, mealName, mealTime } = this;

      if (foodName) {
        params.item = foodName;
        params.food = foodName;
      }

      if (mealName) {
        params.mealName = mealName;

        if (mealTime) {
          params.mealTime = mealTime;

          const meal = `${mealName} (${mealTime})`;
          params.item = meal;
          params.meal = meal;
        } else {
          params.item = mealName;
          params.meal = mealName;
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

    action(type: string, id?: string) {
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
