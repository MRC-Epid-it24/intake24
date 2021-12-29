import Vue from 'vue';
import { Condition, PromptValidationProps } from '@common/prompts';
import { LocaleTranslation } from '@common/types';
import PromptContent from './prompt-content.vue';
import PromptConditions from './prompt-conditions.vue';
import PromptValidation from './prompt-validation.vue';

export default Vue.extend({
  name: 'BasePrompt',

  components: { PromptContent, PromptConditions, PromptValidation },

  props: {
    text: {
      type: Object as () => LocaleTranslation,
      required: true,
    },
    description: {
      type: Object as () => LocaleTranslation,
      required: true,
    },
    conditions: {
      type: Array as () => Condition[],
      required: true,
    },
    validation: {
      type: Object as () => PromptValidationProps,
    },
  },

  methods: {
    update(field: string, value: any) {
      this.$emit(`update:${field}`, value);
    },
    updateLanguage(field: string, lang: string, value: any) {
      this.$emit(`update:${field}`, { ...this.$props[field], [lang]: value });
    },
  },
});
