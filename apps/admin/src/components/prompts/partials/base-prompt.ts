import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { PromptValidationProps } from '@intake24/common/prompts';

import PromptValidation from './prompt-validation.vue';

export default defineComponent({
  name: 'BasePrompt',

  components: { PromptValidation },

  props: {
    validation: {
      type: Object as PropType<PromptValidationProps>,
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
