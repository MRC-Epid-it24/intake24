import type { PropType } from 'vue';
import set from 'lodash/set';
import { defineComponent, onBeforeMount } from 'vue';

import type { ActionItem, Prompt } from '@intake24/common/prompts';
import type { FoodState, MealState } from '@intake24/common/types';
import type { LocaleMessageObject } from '@intake24/i18n';
import { useI18n } from '@intake24/i18n';
import { useFoodUtils, useMealUtils, usePromptUtils } from '@intake24/survey/composables';
import { useSurvey } from '@intake24/survey/stores';

import { Next } from '../actions';
import Breadcrumbs from './breadcrumbs.vue';

export default defineComponent({
  name: 'LayoutMixin',

  components: { Next, Breadcrumbs },

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
    const { i18n, translate, translatePath } = useI18n();
    const { params, type } = usePromptUtils(props);
    const { foodName } = useFoodUtils(props);
    const { mealName, mealTime, mealNameWithTime } = useMealUtils(props);
    const survey = useSurvey();

    const loadPromptTranslations = () => {
      if (!Object.keys(props.prompt.i18n).length) return;

      const locale = i18n.locale;
      const messages = i18n.getLocaleMessage(locale);

      Object.entries(props.prompt.i18n).forEach(([key, value]) => {
        if (!value[locale]) return;

        set(messages, `prompts.${type.value}.${key}`, value[locale]);
      });

      i18n.setLocaleMessage(locale, messages);
    };

    onBeforeMount(() => {
      loadPromptTranslations();
    });

    return {
      foodName,
      translate,
      translatePath,
      mealName,
      mealTime,
      mealNameWithTime,
      params,
      type,
      meals: survey.data.meals,
    };
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

    i18n() {
      return {
        name: this.$t(`prompts.${this.type}.name`, this.params),
        text: this.$t(`prompts.${this.type}.text`, this.params),
        description: this.translatePath(`prompts.${this.type}.description`, this.params, true),
      };
    },
  },

  methods: {
    update(type: string) {
      this.$emit('update:navTab', type);
    },

    action(type: string, ...args: [id?: string, params?: object]) {
      this.update(type);
      this.$emit('action', type, ...args);
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
