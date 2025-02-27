import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import type { Prompt, Prompts, PromptStates } from '@intake24/common/prompts';
import type { EncodedFood, FoodState, MealState, MissingFood, PromptSection, RecipeBuilder } from '@intake24/common/surveys';
import type { UserPortionSizeMethod } from '@intake24/common/types/http';
import { useI18n } from '@intake24/i18n';
import { ExpansionPanelActions, ValidInvalidIcon } from '@intake24/survey/components/elements';
import { useFoodUtils } from '@intake24/survey/composables';
import { promptType } from '@intake24/ui';
import { Next, NextMobile } from '../actions';
import { BaseLayout, CardLayout } from '../layouts';
import { PortionSizeMethods } from './methods';

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
      PortionSizeMethods,
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
      portionSizeMethods: {
        type: Array as PropType<(UserPortionSizeMethod & { index: number })[]>,
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
      modelValue: {
        type: Object as PropType<PromptStates[P]>,
        required: true,
      },
    },

    emits: ['action', 'update:modelValue'],

    data() {
      const food = this.food as unknown as F;
      const parentFood = this.parentFood as unknown as PF;

      const { foodName } = useFoodUtils({ food, parentFood });
      const { translate } = useI18n();

      return {
        foodName,
        errors: [] as string[],
        panel: 0,
        translate,
      };
    },

    computed: {
      hasErrors(): boolean {
        return !!this.errors.length;
      },
      validConditions(): boolean[] {
        return [false];
      },
      nextStepConditions(): boolean[] {
        return this.validConditions;
      },
      psmValid(): boolean {
        return (this.food as FoodState).type === 'encoded-food' && (this.food as EncodedFood).portionSizeMethodIndex !== null;
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

      setPanel(panel: number) {
        this.panel = panel;
      },

      updatePanel() {
        for (const [index, condition] of Object.entries(this.nextStepConditions)) {
          if (!condition) {
            this.panel = Number.parseInt(index);
            return;
          }
        }

        this.closePanels();
      },

      action(type: string, ...args: [id?: string, params?: object]) {
        this.$emit('action', type, ...args);
      },
    },
  });
