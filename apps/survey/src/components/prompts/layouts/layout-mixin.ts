import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type {
  Dictionary,
  EncodedFood,
  LocaleTranslation,
  MealState,
  RequiredLocaleTranslation,
} from '@intake24/common/types';
import { localeContent } from '@intake24/survey/components/mixins';

export default defineComponent({
  name: 'LayoutMixin',

  mixins: [localeContent],

  props: {
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
    update(action: string) {
      this.$emit('update:navAction', action);
    },

    navAction(action: string) {
      if (action === 'next') return;

      this.update(action);
      this.$emit('nav-action', action);
    },

    next() {
      this.update('next');
      this.$emit('nav-action', 'next');
    },
  },
});
