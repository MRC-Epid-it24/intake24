import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompt, Prompts } from '@intake24/common/prompts';
import type { EncodedFood } from '@intake24/common/types';
import { ValidInvalidIcon } from '@intake24/survey/components/elements';
import { localeContent } from '@intake24/survey/components/mixins';
import { promptType } from '@intake24/survey/util';

import { Next } from '../actions';
import { PortionLayout } from '../layouts';

export const CATEGORY_BREAD_TOP_LEVEL = 'BRED';

export default <P extends keyof Prompts, S extends object>() =>
  defineComponent({
    name: 'BasePortion',

    components: { Next, PortionLayout, ValidInvalidIcon },

    mixins: [localeContent],

    props: {
      food: {
        type: Object as PropType<EncodedFood>,
        required: true,
      },
      parentFood: {
        type: Object as PropType<EncodedFood>,
      },
      initialState: {
        type: Object as PropType<S>,
        required: true,
      },
      prompt: {
        type: Object as PropType<Prompts[P]>,
        required: true,
      },
    },

    emits: ['action'],

    data() {
      return {
        errors: [] as string[],
        panel: 0,
      };
    },

    computed: {
      foodName(): string {
        return this.getLocaleContent({ en: this.food.data.localName });
      },

      hasErrors(): boolean {
        return !!this.errors.length;
      },

      validConditions(): boolean[] {
        return [false];
      },

      isValid(): boolean {
        return this.validConditions.every((conditions) => conditions);
      },

      parentQuantity(): number {
        return this.parentFood?.portionSize?.method === 'guide-image'
          ? this.parentFood.portionSize.quantity
          : 0;
      },

      promptForLinkedQuantity(): boolean {
        const { parentFood } = this;
        if (!parentFood || !parentFood.portionSize) return false;

        return (
          parentFood.data.categories.includes(CATEGORY_BREAD_TOP_LEVEL) &&
          parentFood.portionSize.method === 'guide-image' &&
          parentFood.portionSize.quantity > 1
        );
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
        for (const [index, condition] of Object.entries(this.validConditions)) {
          if (!condition) {
            this.panel = Number.parseInt(index);
            return;
          }
        }

        this.closePanels();
      },

      action(type: string, id?: number) {
        this.$emit('action', type, id);
      },
    },
  });
