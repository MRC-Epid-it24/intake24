import Vue from 'vue';
import { Condition, LocaleTranslation, PromptValidationProps } from '@common/types';
import PromptContent from './PromptContent.vue';
import PromptConditions from './PromptConditions.vue';
import PromptValidation from './PromptValidation.vue';

export default Vue.extend({
  name: 'Prompt',

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
