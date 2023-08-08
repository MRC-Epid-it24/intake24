import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

import type { ActionItem, Prompt } from '@intake24/common/prompts';
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
    const { translate } = useI18n();
    const { type } = usePromptUtils(props);
    const { foodName } = useFoodUtils(props);
    const { mealName, mealTime, mealNameWithTime } = useMealUtils(props);
    const survey = useSurvey();

    const params = computed(() => {
      const build: Record<string, string> = {};

      if (foodName.value) {
        build.item = foodName.value;
        build.food = foodName.value;
      }

      if (mealName.value) {
        build.mealName = mealName.value;

        if (mealTime.value) {
          build.mealTime = mealTime.value;

          const meal = `${mealName.value} (${mealTime.value})`;
          build.item = meal;
          build.meal = meal;
        } else {
          build.item = mealName.value;
          build.meal = mealName.value;
        }
      }

      return build;
    });

    return {
      foodName,
      translate,
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
        name: this.translate(this.prompt.i18n.name, {
          path: `prompts.${this.type}.name`,
          params: this.params,
        }),
        text: this.translate(this.prompt.i18n.text, {
          path: `prompts.${this.type}.text`,
          params: this.params,
        }),
        description: this.translate(this.prompt.i18n.description, {
          path: `prompts.${this.type}.description`,
          params: this.params,
          sanitize: true,
        }),
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
