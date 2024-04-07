import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompt, Prompts, PromptStates } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
import type { EncodedFood, MealState, MissingFood, RecipeBuilder } from '@intake24/common/types';
import { useI18n } from '@intake24/i18n';
import { ExpansionPanelActions, ValidInvalidIcon } from '@intake24/survey/components/elements';
import { useFoodUtils } from '@intake24/survey/composables';
import { promptType } from '@intake24/ui';

import { Next, NextMobile } from '../actions';
import { BaseLayout, CardLayout } from '../layouts';

export default <
  P extends keyof Prompts & keyof PromptStates,
  F extends EncodedFood | MissingFood | RecipeBuilder = EncodedFood,
  PF extends EncodedFood | RecipeBuilder = EncodedFood | RecipeBuilder,
>() =>
  defineComponent({
    name: 'BasePortion',

    components: {
      ExpansionPanelActions,
      Next,
      NextMobile,
      BaseLayout,
      CardLayout,
      ValidInvalidIcon,
    },

    props: {
      food: {
        type: Object as PropType<F>,
        required: true,
      },
      parentFood: {
        type: Object as PropType<PF>,
      },
      meal: {
        type: Object as PropType<MealState>,
        required: true,
      },
      prompt: {
        type: Object as PropType<Prompts[P]>,
        required: true,
      },
      section: {
        type: String as PropType<PromptSection>,
        required: true,
      },
      value: {
        type: Object as PropType<PromptStates[P]>,
        required: true,
      },
    },

    emits: ['action'],

    setup(props) {
      const { translate } = useI18n();

      // InferPropType<T> fails on generic types: https://github.com/vuejs/core/pull/9652
      const food = props.food as unknown as F;
      const parentFood = props.parentFood as unknown as PF;

      const { foodName } = useFoodUtils({ food, parentFood });

      return { foodName, translate };
    },

    data() {
      return {
        errors: [] as string[],
        panel: 0,
      };
    },

    computed: {
      hasErrors(): boolean {
        return !!this.errors.length;
      },

      validConditions(): boolean[] {
        return [false];
      },

      isValid(): boolean {
        return this.validConditions.every(conditions => conditions);
      },

      type() {
        return promptType((this.prompt as Prompt).component);
      },
    },

    methods: {
      clearErrors() {
        this.errors = [];
      },

      closePanels() {
        this.panel = -1;
      },

      async goToActions() {
        if (this.panel === -1)
          return;

        setTimeout(async () => {
          await this.$vuetify.goTo('#actions', { duration: 1000 });
        }, 100);
      },

      setPanel(panel: number) {
        this.panel = panel;
      },

      updatePanel() {
        for (const [index, condition] of Object.entries(this.validConditions)) {
          if (!condition) {
            this.panel = Number.parseInt(index);
            return;
          }
        }

        this.closePanels();
      },

      action(type: string, id?: string) {
        this.$emit('action', type, id);
      },
    },
  });
