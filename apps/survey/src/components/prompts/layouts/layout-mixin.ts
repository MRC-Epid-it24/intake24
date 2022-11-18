import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { ActionItem, Actions } from '@intake24/common/prompts';
import type {
  Dictionary,
  EncodedFood,
  LocaleTranslation,
  MealState,
  RequiredLocaleTranslation,
} from '@intake24/common/types';
import { localeContent } from '@intake24/survey/components/mixins';

import { Next } from '../actions';

export default defineComponent({
  name: 'LayoutMixin',

  components: { Next },

  mixins: [localeContent],

  props: {
    actions: {
      type: Object as PropType<Actions>,
      default: () => ({ both: false, items: [] }),
    },
    text: {
      type: [Object, String] as PropType<RequiredLocaleTranslation | string>,
      required: true,
    },
    description: {
      type: [Object, String] as PropType<LocaleTranslation | string | null>,
      default: null,
    },
    meal: {
      type: Object as PropType<MealState>,
    },
    food: {
      type: Object as PropType<EncodedFood>,
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

  computed: {
    desktopActions(): ActionItem[] {
      return this.actions.items.filter((action) => action.layout.includes('desktop'));
    },

    mobileActions(): ActionItem[] {
      return this.actions.items.filter((action) => action.layout.includes('mobile'));
    },

    localeFoodName() {
      return this.food && this.getLocaleContent(this.food.data.localName);
    },

    localeMealName() {
      return this.meal && this.getLocaleContent(this.meal.name);
    },

    localeText(): string {
      const params: Dictionary<string> = {};
      const { localeFoodName, localeMealName } = this;
      if (localeFoodName) params.food = localeFoodName;
      if (localeMealName) params.meal = localeMealName;

      return this.getLocaleContent(this.text, { params });
    },

    localeDescription(): string | null {
      if (!this.description) return null;

      const params: Dictionary<string> = {};
      const { localeFoodName, localeMealName } = this;
      if (localeFoodName) params.food = localeFoodName;
      if (localeMealName) params.meal = localeMealName;

      return this.getLocaleContent(this.description, { params });
    },

    hasDefaultSlot(): boolean {
      return !!this.$slots.default;
    },

    hasActionsSlot(): boolean {
      return !!this.$slots.actions;
    },
  },

  methods: {
    update(type: string) {
      this.$emit('update:navTab', type);
    },

    action(type: string) {
      if (!['addMeal', 'review'].includes(type)) return;

      this.update(type);
      this.$emit('action', type);
    },

    next() {
      this.update('next');
      this.$emit('action', 'next');
    },
  },
});
