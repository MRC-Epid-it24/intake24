import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type {
  BasePromptProps,
  PortionSizeComponentType,
  PromptQuestion,
} from '@intake24/common/prompts';
import type { LocaleTranslation } from '@intake24/common/types';
import { portionSizePromptQuestions } from '@intake24/common/prompts';
import { merge } from '@intake24/common/util';
import { ValidInvalidIcon } from '@intake24/survey/components/elements';
import PortionLayout from '@intake24/survey/components/layouts/PortionLayout.vue';
import { localeContent } from '@intake24/survey/components/mixins';
import Continue from '@intake24/survey/components/prompts/actions/Continue.vue';

export default <P extends BasePromptProps, S extends object>() =>
  defineComponent({
    name: 'BasePortion',

    components: { Continue, PortionLayout, ValidInvalidIcon },

    mixins: [localeContent],

    props: {
      continueEnabled: {
        type: Boolean,
        required: true,
      },
      foodName: {
        type: Object as PropType<LocaleTranslation>,
        required: true,
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
      hasErrors(): boolean {
        return !!this.errors.length;
      },
    },

    methods: {
      setPanel(panel: number) {
        this.panel = panel;
      },

      closePanels() {
        this.panel = -1;
      },

      clearErrors() {
        this.errors = [];
      },
    },
  });
