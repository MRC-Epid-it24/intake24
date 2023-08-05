import type { PropType } from 'vue';
import { defineComponent, toRefs } from 'vue';

import type { Prompt, Prompts, PromptStates } from '@intake24/common/prompts';
import type { EncodedFood, MealState, MissingFood, RecipeBuilder } from '@intake24/common/types';
import { ExpansionPanelActions, ValidInvalidIcon } from '@intake24/survey/components/elements';
import { useFoodUtils } from '@intake24/survey/composables';
import { useLocale } from '@intake24/ui';
import { promptType } from '@intake24/ui/util';

import { Next } from '../actions';
import { BaseLayout, CardLayout } from '../layouts';

export default <
  P extends keyof Prompts & keyof PromptStates,
  F extends EncodedFood | MissingFood | RecipeBuilder = EncodedFood,
>() =>
  defineComponent({
    name: 'BasePortion',

    components: { ExpansionPanelActions, Next, BaseLayout, CardLayout, ValidInvalidIcon },

    props: {
      food: {
        type: Object as PropType<F>,
        required: true,
      },
      parentFood: {
        type: Object as PropType<EncodedFood>,
      },
      meal: {
        type: Object as PropType<MealState>,
        required: true,
      },
      initialState: {
        type: Object as PropType<PromptStates[P]>,
        required: true,
      },
      prompt: {
        type: Object as PropType<Prompts[P]>,
        required: true,
      },
    },

    emits: ['action'],

    setup(props) {
      const { food } = toRefs(props);

      const { getLocaleContent } = useLocale();
      const { foodName } = useFoodUtils(food);

      return { foodName, getLocaleContent };
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
        return this.validConditions.every((conditions) => conditions);
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
        if (this.panel === -1) return;

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
