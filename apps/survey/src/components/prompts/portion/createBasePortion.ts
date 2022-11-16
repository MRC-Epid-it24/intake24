import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type {
  BasePromptProps,
  PortionSizeComponentType,
  PromptQuestion,
} from '@intake24/common/prompts';
import type { EncodedFood } from '@intake24/common/types';
import { portionSizePromptQuestions } from '@intake24/common/prompts';
import { merge } from '@intake24/common/util';
import { ValidInvalidIcon } from '@intake24/survey/components/elements';
import { localeContent } from '@intake24/survey/components/mixins';

import { Next } from '../actions';
import { PortionLayout } from '../layouts';

export const CATEGORY_BREAD_TOP_LEVEL = 'BRED';

export default <P extends BasePromptProps, S extends object>() =>
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
      promptComponent: {
        type: String as PropType<PortionSizeComponentType>,
        required: true,
      },
      promptProps: {
        type: Object as PropType<P>,
        required: true,
      },
    },

    data() {
      const question = portionSizePromptQuestions.find(
        ({ component }) => component === this.promptComponent
      ) as PromptQuestion<P> | undefined;

      const props = (
        question ? merge(question.props, this.promptProps as P) : this.promptProps
      ) as P;

      return {
        ...props,
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
    },

    mounted() {
      this.$emit('update', { valid: this.isValid });
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

      action(type: string) {
        this.$emit('action', type);
      },
    },
  });
