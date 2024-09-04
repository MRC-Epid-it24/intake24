import type { PropType } from 'vue';
import get from 'lodash/get';
import set from 'lodash/set';
import { computed, defineComponent, onBeforeMount } from 'vue';

import type { ActionItem, Prompt } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
import type { FoodState, MealState } from '@intake24/common/types';
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
    section: {
      type: String as PropType<PromptSection>,
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
  },

  emits: ['action'],

  setup(props, ctx) {
    const { defaultMessages, i18n, translate, translatePath } = useI18n();
    const { action, isInMultiPrompt, params, type } = usePromptUtils(props, ctx);
    const { foodName } = useFoodUtils(props);
    const { mealName, mealTime, mealNameWithTime } = useMealUtils(props);
    const survey = useSurvey();

    const meals = computed(() => survey.data.meals);
    const showSummary = computed(() => {
      if (props.prompt.component === 'submit-prompt' && props.prompt.review.mobile !== false)
        return false;

      if (survey.hasFinished)
        return false;

      return !['preMeals'].includes(props.section);
    });

    const loadPromptTranslations = () => {
      const locale = i18n.locale;
      const messages = i18n.getLocaleMessage(locale);

      const defaultPromptMessages = get(
        defaultMessages.getMessages(locale),
        `prompts.${type.value}`,
      );

      if (defaultPromptMessages === undefined) {
        console.error(`Failed to load default translation messages using key "prompts.${type.value}", locale "${locale}". Please update the translation files!`);
      }
      else {
        Object.entries(defaultPromptMessages).forEach(([key, value]) => {
          set(messages, `prompts.${type.value}.${key}`, props.prompt.i18n[key]?.[locale] ?? value);
        });
      }

      i18n.setLocaleMessage(locale, messages);
    };

    onBeforeMount(() => {
      loadPromptTranslations();
    });

    return {
      action,
      foodName,
      translate,
      translatePath,
      isInMultiPrompt,
      mealName,
      mealTime,
      mealNameWithTime,
      params,
      showSummary,
      type,
      meals,
    };
  },

  computed: {
    foodOrMealId() {
      return this.food?.id ?? this.meal?.id;
    },

    desktopActions(): ActionItem[] {
      return this.prompt.actions?.items.filter(action => action.layout.includes('desktop')) ?? [];
    },

    hasDefaultSlot(): boolean {
      return !!this.$slots.default;
    },

    hasActionsSlot(): boolean {
      return !!this.$slots.actions;
    },

    hasNavActionsSlot(): boolean {
      return !!this.$slots['nav-actions'];
    },

    mobileActions(): ActionItem[] {
      return this.prompt.actions?.items.filter(action => action.layout.includes('mobile')) ?? [];
    },

    i18n() {
      /*
       * Workaround for multi-prompt i18n
       * - at the moment scheme prompt i18n is merged into the vue-i18n instance messages, so it can be used directly
       * - this approach allows use of vue-i18n component to interpolate the i18n strings
       * - however multi-prompt is displaying multiple prompts at once, so same prompt types override each other
       * - TODO: implement own vue-i18n component and merge the i18n outside of the vue-i18n instance?
       */
      return {
        /* name: this.$t(`prompts.${this.type}.name`, this.params),
        text: this.$t(`prompts.${this.type}.text`, this.params),
        description: this.translatePath(`prompts.${this.type}.description`, this.params, true), */
        name: this.translate(this.prompt.i18n.name, {
          params: this.params,
          path: `prompts.${this.type}.name`,
        }),
        text: this.translate(this.prompt.i18n.text, {
          params: this.params,
          path: `prompts.${this.type}.text`,
        }),
        description: this.translate(this.prompt.i18n.description, {
          params: this.params,
          path: `prompts.${this.type}.description`,
          sanitize: true,
        }),
      };
    },
  },
});
